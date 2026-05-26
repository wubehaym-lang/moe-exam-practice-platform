/* ================================================================
   APPWRITE-SYNC.JS
   Mirrors selected localStorage keys to an Appwrite Database
   collection so data is shared across all computers.
   Works exactly like the old firebase-sync.js — the rest of
   the app does NOT need to change at all.

   FIXES APPLIED:
   1. Removed "currentUser" from MIRROR_KEYS — it is per-session
      and must NEVER be shared across devices. Sharing it caused
      every device to be logged in as whoever last logged in anywhere.
   2. Removed pushExistingLocalToAppwrite() from boot() — pushing
      stale local data to the cloud on every login was overwriting
      other users' password changes and erasing updates.
   ================================================================ */
(function () {

  // ── Keys that get synced to Appwrite ─────────────────────────
  const MIRROR_PREFIXES = [
    "examFinished_",
    "finishTime_",
    "examEndTime_",
    "examUnlocked_",
    "userLogintime_"
  ];
  const MIRROR_KEYS = new Set([
    // ✅ FIX 1: "currentUser" removed — it is per-device/session only.
    // Syncing it made ALL devices share one currentUser, so logging in
    // as User A caused every other device to also become User A.
    "allUsers", "globalExamSettings",
    "adminGlobalPass", "adminAuthenticated", "isAdmin",
    "examData", "currentIndex", "currentStream",
    "savedSubject", "savedExamType", "currentPage"
  ]);

  const isMirrorKey = (key) => {
    if (!key) return false;
    if (MIRROR_KEYS.has(key)) return true;
    return MIRROR_PREFIXES.some(p => key.startsWith(p));
  };

  // ── Convert any localStorage key → valid Appwrite document ID ─
  // Appwrite doc IDs: max 36 chars, only [a-zA-Z0-9._-]
  function keyToDocId(key) {
    const safe = key.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (safe.length <= 36) return safe;
    // For long keys: use first 27 chars + underscore + FNV-1a hash
    let h = 0x811c9dc5;
    for (let i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = (Math.imul(h, 0x01000193)) >>> 0;
    }
    return (safe.substring(0, 27) + '_' + h.toString(36)).substring(0, 36);
  }

  // ── Check config is filled in ─────────────────────────────────
  const hasConfig = () => {
    const cfg = window.APPWRITE_CONFIG || {};
    return !!(
      cfg.endpoint && cfg.projectId && cfg.databaseId && cfg.collectionId &&
      cfg.projectId   !== "YOUR_PROJECT_ID" &&
      cfg.databaseId  !== "YOUR_DATABASE_ID" &&
      cfg.collectionId !== "YOUR_COLLECTION_ID"
    );
  };

  // ── Module-level state ─────────────────────────────────────────
  let databases     = null;
  let databaseId    = '';
  let collectionId  = '';
  let ready         = false;
  let syncing       = false;   // prevents feedback loops
  const pendingWrites = new Set();

  // ── Session-only user helper (replaces localStorage currentUser) ─
  window.getCurrentUser = function () {
    try {
      return JSON.parse(sessionStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  };
  window.setCurrentUser = function (user) {
    if (user === null || user === undefined) {
      sessionStorage.removeItem("currentUser");
      localStorage.removeItem("currentUser");
      return;
    }
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.removeItem("currentUser");
  };
  window.clearCurrentUser = function () {
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("currentUser");
  };

  // ── Safe localStorage write (won't trigger our mirror hook) ───
  function safeSetLocal(key, value) {
    syncing = true;
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, String(value));
      }
    } finally {
      syncing = false;
    }
  }


  function trackWrite(promise) {
    if (!promise || typeof promise.finally !== 'function') return promise;
    pendingWrites.add(promise);
    promise.finally(() => pendingWrites.delete(promise));
    return promise;
  }

  async function waitForWrites() {
    if (window.appwriteMirrorReady) {
      await window.appwriteMirrorReady;
    }
    while (pendingWrites.size > 0) {
      const current = Array.from(pendingWrites);
      await Promise.allSettled(current);
    }
  }

  function ensureSavingIndicator() {
    let box = document.getElementById('appwriteSavingToast');
    if (box) return box;

    box = document.createElement('div');
    box.id = 'appwriteSavingToast';
    box.setAttribute('aria-live', 'polite');
    box.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:16px',
      'z-index:99999',
      'display:none',
      'align-items:center',
      'gap:8px',
      'padding:10px 14px',
      'border-radius:999px',
      'background:rgba(24,35,58,.96)',
      'color:#fff',
      'font:600 14px/1.2 sans-serif',
      'box-shadow:0 10px 24px rgba(0,0,0,.22)'
    ].join(';');

    const label = document.createElement('span');
    label.id = 'appwriteSavingToastLabel';
    label.textContent = 'Saving';

    const dots = document.createElement('span');
    dots.id = 'appwriteSavingToastDots';
    dots.textContent = '.';

    box.appendChild(label);
    box.appendChild(dots);
    document.body.appendChild(box);

    let frame = 0;
    const timer = setInterval(() => {
      const el = document.getElementById('appwriteSavingToastDots');
      if (!el) {
        clearInterval(timer);
        return;
      }
      frame = (frame + 1) % 4;
      el.textContent = '.'.repeat(frame || 1);
    }, 350);
    box.dataset.timerId = String(timer);
    return box;
  }

  function showSavingIndicator(message = 'Saving') {
    const box = ensureSavingIndicator();
    const label = document.getElementById('appwriteSavingToastLabel');
    if (label) label.textContent = message;
    box.style.display = 'inline-flex';
  }

  function hideSavingIndicator() {
    const box = document.getElementById('appwriteSavingToast');
    if (!box) return;
    const timerId = Number(box.dataset.timerId || 0);
    if (timerId) clearInterval(timerId);
    box.remove();
  }

  // ── Initialize Appwrite client ─────────────────────────────────
  function initAppwrite() {
    if (!hasConfig()) {
      console.warn("Appwrite sync: config not filled in — running offline only.");
      return false;
    }
    const aw = window.Appwrite;
    if (!aw || !aw.Client || !aw.Databases) {
      console.warn("Appwrite sync: SDK not loaded.");
      return false;
    }
    const cfg = window.APPWRITE_CONFIG;
    const client = new aw.Client()
      .setEndpoint(cfg.endpoint)
      .setProject(cfg.projectId);
    databases    = new aw.Databases(client);
    databaseId   = cfg.databaseId;
    collectionId = cfg.collectionId;
    return true;
  }

  // ── Fetch single document (returns null if not found) ─────────
  async function getDoc(docId) {
    try {
      return await databases.getDocument(databaseId, collectionId, docId);
    } catch (e) {
      if (e.code === 404) return null;
      throw e;
    }
  }

  // ── Write a key/value pair to Appwrite ────────────────────────
  async function setDoc(key, value) {
    if (!databases) return;
    const docId = keyToDocId(key);
    try {
      const existing = await getDoc(docId);
      if (existing) {
        await databases.updateDocument(databaseId, collectionId, docId, { value: String(value) });
      } else {
        await databases.createDocument(databaseId, collectionId, docId, { key: key, value: String(value) });
      }
    } catch (err) {
      console.warn("Appwrite set failed [" + key + "]:", err.message || err);
    }
  }

  // ── Delete a key from Appwrite ────────────────────────────────
  async function deleteDoc(key) {
    if (!databases) return;
    const docId = keyToDocId(key);
    try {
      await databases.deleteDocument(databaseId, collectionId, docId);
    } catch (e) {
      if (e.code !== 404) console.warn("Appwrite delete failed [" + key + "]:", e.message || e);
    }
  }

  // ── Load ALL data from Appwrite into localStorage ─────────────
  async function hydrateFromAppwrite() {
    if (!databases) return;
    try {
      const aw = window.Appwrite;
      let allDocs = [];
      let offset  = 0;
      while (true) {
        const res = await databases.listDocuments(databaseId, collectionId, [
          aw.Query.limit(100),
          aw.Query.offset(offset)
        ]);
        allDocs = allDocs.concat(res.documents);
        if (allDocs.length >= res.total || res.documents.length === 0) break;
        offset += 100;
      }
      allDocs.forEach(doc => {
        const key = doc.key;
        if (isMirrorKey(key) && doc.value !== undefined && doc.value !== null) {
          safeSetLocal(key, doc.value);
        }
      });
    } catch (err) {
      console.warn("Appwrite hydrate failed:", err.message || err);
    }
  }

  // ── Intercept localStorage to mirror writes to Appwrite ───────
  function attachMirrors() {
    if (!window.Storage || Storage.prototype.__appwriteMirrorPatched) return;

    const origSet    = Storage.prototype.setItem;
    const origRemove = Storage.prototype.removeItem;
    const origClear  = Storage.prototype.clear;

    Storage.prototype.setItem = function (key, value) {
      origSet.call(this, key, value);
      if (this !== localStorage || syncing || !ready || !databases || !isMirrorKey(key)) return;
      trackWrite(setDoc(key, value));
    };

    Storage.prototype.removeItem = function (key) {
      origRemove.call(this, key);
      if (this !== localStorage || syncing || !ready || !databases || !isMirrorKey(key)) return;
      trackWrite(deleteDoc(key));
    };

    Storage.prototype.clear = function () {
      if (this !== localStorage || syncing || !ready || !databases) {
        origClear.call(this);
        return;
      }
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (isMirrorKey(k)) keys.push(k);
      }
      origClear.call(this);
      keys.forEach(k => trackWrite(deleteDoc(k)));
    };

    Storage.prototype.__appwriteMirrorPatched = true;
  }

  // ── Boot sequence ─────────────────────────────────────────────
  async function boot() {
    if (!initAppwrite()) return;
    attachMirrors();
    await hydrateFromAppwrite();  // pull fresh cloud data → localStorage
    // ✅ FIX 2: pushExistingLocalToAppwrite() intentionally removed.
    // Calling it on every login was pushing each device's OLD local copy
    // of allUsers back to the cloud, erasing any password changes other
    // users had made since this device last synced. The setItem mirror
    // hook above handles all future writes automatically — no bulk push needed.
    ready = true;
    window.__appwriteMirrorReady = true;
    console.log("Appwrite sync: ready ✓");
  }

  window.appwriteMirrorReady = boot();

  // ── Manual helpers (for debugging + save waits) ─────────────
  window.appwriteMirror = {
    async refresh() { if (databases) await hydrateFromAppwrite(); },
    async waitForWrites() { await waitForWrites(); },
    showSaving: showSavingIndicator,
    hideSaving: hideSavingIndicator
  };

})();
