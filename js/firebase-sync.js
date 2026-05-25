/* Firebase localStorage mirror
   This keeps the existing app working while moving data to Firebase Realtime Database.
   It mirrors selected localStorage keys to /mirror/<key>.
*/
(function () {
  const STORAGE_ROOT = "mirror";
  const MIRROR_PREFIXES = [
    "examFinished_",
    "finishTime_",
    "examEndTime_",
    "examUnlocked_",
    "userLogintime_"
  ];
  const MIRROR_KEYS = new Set([
    "allUsers",
    "currentUser",
    "globalExamSettings",
    "adminGlobalPass",
    "adminAuthenticated",
    "isAdmin",
    "examData",
    "currentIndex",
    "currentStream",
    "savedSubject",
    "savedExamType",
    "currentPage"
  ]);

  const isMirrorKey = (key) => {
    if (!key) return false;
    if (MIRROR_KEYS.has(key)) return true;
    return MIRROR_PREFIXES.some(prefix => key.startsWith(prefix));
  };

  const hasConfig = () => {
    const cfg = window.FIREBASE_CONFIG || {};
    return !!(cfg.apiKey && cfg.authDomain && cfg.databaseURL && cfg.projectId && cfg.appId);
  };

  let app = null;
  let db = null;
  let ready = false;
  let syncing = false;

  function safeEncode(key) {
    return encodeURIComponent(key);
  }

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

  function initFirebase() {
    if (!hasConfig()) return false;
    if (!window.firebase || !window.firebase.initializeApp || !window.firebase.database) return false;
    if (!window.__firebaseMirrorApp) {
      app = firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(window.FIREBASE_CONFIG);
      db = firebase.database(app);
      window.__firebaseMirrorApp = app;
      window.__firebaseMirrorDb = db;
    } else {
      app = window.__firebaseMirrorApp;
      db = window.__firebaseMirrorDb;
    }
    return true;
  }

  async function hydrateFromFirebase() {
    if (!db) return;
    try {
      const snap = await db.ref(STORAGE_ROOT).once("value");
      const data = snap.val() || {};
      Object.entries(data).forEach(([encodedKey, value]) => {
        const key = decodeURIComponent(encodedKey);
        if (isMirrorKey(key) && value !== undefined) {
          safeSetLocal(key, value);
        }
      });
    } catch (err) {
      console.warn("Firebase hydrate failed:", err);
    }
  }

  async function pushExistingLocalToFirebase() {
    if (!db) return;
    try {
      const updates = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!isMirrorKey(key)) continue;
        updates[`${STORAGE_ROOT}/${safeEncode(key)}`] = localStorage.getItem(key);
      }
      if (Object.keys(updates).length) {
        await db.ref().update(updates);
      }
    } catch (err) {
      console.warn("Firebase sync push failed:", err);
    }
  }

  function attachMirrors() {
    if (!window.Storage || Storage.prototype.__firebaseMirrorPatched) return;
    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    const originalClear = Storage.prototype.clear;

    Storage.prototype.setItem = function (key, value) {
      originalSetItem.call(this, key, value);
      if (this !== localStorage || syncing || !ready || !db || !isMirrorKey(key)) return;
      db.ref(`${STORAGE_ROOT}/${safeEncode(key)}`).set(String(value)).catch(err => console.warn("Firebase set failed:", err));
    };

    Storage.prototype.removeItem = function (key) {
      originalRemoveItem.call(this, key);
      if (this !== localStorage || syncing || !ready || !db || !isMirrorKey(key)) return;
      db.ref(`${STORAGE_ROOT}/${safeEncode(key)}`).remove().catch(err => console.warn("Firebase remove failed:", err));
    };

    Storage.prototype.clear = function () {
      if (this !== localStorage || syncing || !ready || !db) {
        originalClear.call(this);
        return;
      }
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (isMirrorKey(key)) keys.push(key);
      }
      originalClear.call(this);
      const removals = keys.map(key => db.ref(`${STORAGE_ROOT}/${safeEncode(key)}`).remove());
      Promise.all(removals).catch(err => console.warn("Firebase clear failed:", err));
    };

    Storage.prototype.__firebaseMirrorPatched = true;
  }

  async function boot() {
    if (!initFirebase()) return;
    attachMirrors();
    await hydrateFromFirebase();
    await pushExistingLocalToFirebase();
    ready = true;
    window.__firebaseMirrorReady = true;
  }

  window.firebaseMirrorReady = boot();

  // Expose helpers for debugging or manual sync if needed.
  window.firebaseMirror = {
    async refresh() {
      if (!db) return;
      await hydrateFromFirebase();
    },
    async flush() {
      if (!db) return;
      await pushExistingLocalToFirebase();
    }
  };
})();
