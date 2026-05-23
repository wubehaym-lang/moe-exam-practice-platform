/* ================================================================
   APPWRITE-SYNC.JS
   Mirrors selected localStorage keys to an Appwrite Database
   collection so data is shared across all computers.
   Works exactly like the old firebase-sync.js — the rest of
   the app does NOT need to change at all.
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
    "allUsers", "currentUser", "globalExamSettings",
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

  // ── Push any existing localStorage data up to Appwrite ────────
  async function pushExistingLocalToAppwrite() {
    if (!databases) return;
    const writes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!isMirrorKey(key)) continue;
      writes.push(setDoc(key, localStorage.getItem(key)));
    }
    await Promise.allSettled(writes);
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
      setDoc(key, value);
    };

    Storage.prototype.removeItem = function (key) {
      origRemove.call(this, key);
      if (this !== localStorage || syncing || !ready || !databases || !isMirrorKey(key)) return;
      deleteDoc(key);
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
      keys.forEach(k => deleteDoc(k));
    };

    Storage.prototype.__appwriteMirrorPatched = true;
  }

  // ── Boot sequence ─────────────────────────────────────────────
  async function boot() {
    if (!initAppwrite()) return;
    attachMirrors();
    await hydrateFromAppwrite();     // pull cloud data → localStorage
    await pushExistingLocalToAppwrite(); // push local data → cloud
    ready = true;
    window.__appwriteMirrorReady = true;
    console.log("Appwrite sync: ready ✓");
  }

  window.appwriteMirrorReady = boot();

  // ── Manual helpers (for debugging) ───────────────────────────
  window.appwriteMirror = {
    async refresh() { if (databases) await hydrateFromAppwrite(); },
    async flush()   { if (databases) await pushExistingLocalToAppwrite(); }
  };

})();
