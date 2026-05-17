// ============================================================
//  api.js — MOE Exam Practice Platform
//  This file connects all pages to the server database.
//  It replaces localStorage for shared data.
// ============================================================

const API = {

    // ── STUDENT LOGIN ───────────────────────────────────────
    async login(username, password) {
        try {
            const res  = await fetch('/api/login', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ username, password })
            });
            return await res.json();
        } catch (e) {
            console.error('Login error:', e);
            return { success: false, message: 'Cannot connect to server. Is the server running?' };
        }
    },

    // ── GET ALL STUDENTS (for admin pages) ──────────────────
    async getUsers() {
        try {
            const res = await fetch('/api/users');
            return await res.json();
        } catch (e) {
            console.error('getUsers error:', e);
            return [];
        }
    },

    // ── REGISTER A STUDENT ──────────────────────────────────
    async registerUser(userData) {
        try {
            const res  = await fetch('/api/users', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(userData)
            });
            return await res.json();
        } catch (e) {
            console.error('registerUser error:', e);
            return { success: false, message: 'Cannot connect to server.' };
        }
    },

    // ── UPDATE STUDENT DATA (password change, results, etc.) 
    async updateUser(username, data) {
        try {
            const res  = await fetch(`/api/users/${encodeURIComponent(username)}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('updateUser error:', e);
            return { success: false, message: 'Cannot connect to server.' };
        }
    },

    // ── DELETE A STUDENT ────────────────────────────────────
    async deleteUser(username) {
        try {
            const res = await fetch(`/api/users/${encodeURIComponent(username)}`, {
                method: 'DELETE'
            });
            return await res.json();
        } catch (e) {
            console.error('deleteUser error:', e);
            return { success: false };
        }
    },

    // ── GET EXAM SETTINGS ───────────────────────────────────
    async getSettings() {
        try {
            const res = await fetch('/api/settings');
            return await res.json();
        } catch (e) {
            console.error('getSettings error:', e);
            return null;
        }
    },

    // ── SAVE EXAM SETTINGS ──────────────────────────────────
    async saveSettings(settings) {
        try {
            const res  = await fetch('/api/settings', {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(settings)
            });
            return await res.json();
        } catch (e) {
            console.error('saveSettings error:', e);
            return { success: false };
        }
    },

    // ── VERIFY ADMIN PASSWORD ───────────────────────────────
    async verifyAdminPassword(password) {
        try {
            const res  = await fetch('/api/admin/verify', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ password })
            });
            return await res.json();
        } catch (e) {
            console.error('verifyAdmin error:', e);
            return { success: false };
        }
    },

    // ── CHANGE ADMIN PASSWORD ───────────────────────────────
    async changeAdminPassword(oldPassword, newPassword) {
        try {
            const res  = await fetch('/api/admin/password', {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ oldPassword, newPassword })
            });
            return await res.json();
        } catch (e) {
            console.error('changeAdminPassword error:', e);
            return { success: false, message: 'Cannot connect to server.' };
        }
    },

    // ── HELPER: Get current logged-in user from sessionStorage
    getCurrentUser() {
        try {
            return JSON.parse(sessionStorage.getItem('currentUser')) || null;
        } catch (e) {
            return null;
        }
    },

    // ── HELPER: Save current user to sessionStorage ─────────
    setCurrentUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    },

    // ── HELPER: Clear session (logout) ──────────────────────
    logout() {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
};
