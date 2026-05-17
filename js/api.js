// ============================================================
//  api.js — MOE Exam Practice Platform
//  UNIVERSAL VERSION — works on BOTH:
//    1. GitHub Pages (uses localStorage automatically)
//    2. School local server (uses server database)
//  No manual changes needed — detects environment itself
// ============================================================

const IS_GITHUB_PAGES = window.location.hostname.includes('github.io')
                     || window.location.protocol === 'file:';

// ── STORAGE HELPERS (GitHub Pages / offline fallback) ────────
const LOCAL = {
    getUsers()           { return JSON.parse(localStorage.getItem('allUsers')) || []; },
    saveUsers(users)     { localStorage.setItem('allUsers', JSON.stringify(users)); },
    getSettings()        { return JSON.parse(localStorage.getItem('globalExamSettings')) || null; },
    saveSettings(s)      { localStorage.setItem('globalExamSettings', JSON.stringify(s)); },
    getAdminPass()       { return localStorage.getItem('adminGlobalPass') || '1236'; },
    setAdminPass(p)      { localStorage.setItem('adminGlobalPass', p); },
};

// ── EMERGENCY RESET (works on both versions) ─────────────────
if (window.location.search.includes('reset')) {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminGlobalPass');
    localStorage.setItem('adminGlobalPass', '1236');
    sessionStorage.removeItem('adminAuthenticated');
    window.history.replaceState({}, '', window.location.pathname);
    console.log('%c Admin reset done. Password restored to: 1236', 'color:green;font-weight:bold');
}

// ── API OBJECT ────────────────────────────────────────────────
const API = {

    // ── LOGIN ─────────────────────────────────────────────────
    async login(username, password) {
        if (IS_GITHUB_PAGES) {
            // GitHub Pages: use localStorage
            if (username === 'admin' && password === '1234') {
                return { success: true, isAdmin: true };
            }
            const users = LOCAL.getUsers();
            if (users.length === 0) return { success: false, message: 'No students registered yet.' };
            const idx = users.findIndex(u => u.username === username && u.password === password);
            if (idx !== -1) {
                const now = new Date().toLocaleString('en-GB', {
                    weekday:'long', day:'numeric', month:'long',
                    year:'numeric', hour:'numeric', minute:'2-digit', hour12:true
                });
                users[idx].lastLogin    = users[idx].currentLogin || 'First time access';
                users[idx].currentLogin = now;
                LOCAL.saveUsers(users);
                return { success: true, isAdmin: false, user: users[idx] };
            }
            return { success: false, message: 'Invalid username or password.' };
        }

        // School server: use API
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Cannot connect to server. Is it running?' };
        }
    },

    // ── GET ALL STUDENTS ──────────────────────────────────────
    async getUsers() {
        if (IS_GITHUB_PAGES) return LOCAL.getUsers();
        try {
            const res = await fetch('/api/users');
            return await res.json();
        } catch (e) { return []; }
    },

    // ── REGISTER STUDENT ──────────────────────────────────────
    async registerUser(userData) {
        if (IS_GITHUB_PAGES) {
            const users = LOCAL.getUsers();
            if (users.find(u => u.username === userData.username)) {
                return { success: false, message: 'Student ID already exists.' };
            }
            users.push(userData);
            LOCAL.saveUsers(users);
            return { success: true };
        }
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return await res.json();
        } catch (e) { return { success: false, message: 'Cannot connect to server.' }; }
    },

    // ── UPDATE STUDENT ────────────────────────────────────────
    async updateUser(username, data) {
        if (IS_GITHUB_PAGES) {
            const users = LOCAL.getUsers();
            const idx   = users.findIndex(u => u.username === username);
            if (idx === -1) return { success: false, message: 'Student not found.' };
            users[idx] = { ...users[idx], ...data };
            LOCAL.saveUsers(users);
            return { success: true, user: users[idx] };
        }
        try {
            const res = await fetch(`/api/users/${encodeURIComponent(username)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) { return { success: false, message: 'Cannot connect to server.' }; }
    },

    // ── DELETE STUDENT ────────────────────────────────────────
    async deleteUser(username) {
        if (IS_GITHUB_PAGES) {
            const users = LOCAL.getUsers().filter(u => u.username !== username);
            LOCAL.saveUsers(users);
            return { success: true };
        }
        try {
            const res = await fetch(`/api/users/${encodeURIComponent(username)}`, { method: 'DELETE' });
            return await res.json();
        } catch (e) { return { success: false }; }
    },

    // ── GET EXAM SETTINGS ─────────────────────────────────────
    async getSettings() {
        if (IS_GITHUB_PAGES) return LOCAL.getSettings();
        try {
            const res = await fetch('/api/settings');
            return await res.json();
        } catch (e) { return null; }
    },

    // ── SAVE EXAM SETTINGS ────────────────────────────────────
    async saveSettings(settings) {
        if (IS_GITHUB_PAGES) {
            LOCAL.saveSettings(settings);
            return { success: true };
        }
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            return await res.json();
        } catch (e) { return { success: false }; }
    },

    // ── VERIFY ADMIN PASSWORD ─────────────────────────────────
    async verifyAdminPassword(password) {
        if (IS_GITHUB_PAGES) {
            return { success: password === LOCAL.getAdminPass() };
        }
        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            return await res.json();
        } catch (e) { return { success: false }; }
    },

    // ── CHANGE ADMIN PASSWORD ─────────────────────────────────
    async changeAdminPassword(oldPassword, newPassword) {
        if (IS_GITHUB_PAGES) {
            if (oldPassword !== LOCAL.getAdminPass()) {
                return { success: false, message: 'Current password incorrect!' };
            }
            if (!newPassword || newPassword.length < 4) {
                return { success: false, message: 'New password must be at least 4 characters!' };
            }
            LOCAL.setAdminPass(newPassword);
            return { success: true };
        }
        try {
            const res = await fetch('/api/admin/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            return await res.json();
        } catch (e) { return { success: false, message: 'Cannot connect to server.' }; }
    },

    // ── SESSION HELPERS ───────────────────────────────────────
    getCurrentUser() {
        try {
            // Try sessionStorage first, fall back to localStorage
            return JSON.parse(sessionStorage.getItem('currentUser'))
                || JSON.parse(localStorage.getItem('currentUser'))
                || null;
        } catch (e) { return null; }
    },

    setCurrentUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        // Also keep in localStorage for pages that still read from it
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    logout() {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('adminAuthenticated');
        window.location.href = 'index.html';
    }
};
