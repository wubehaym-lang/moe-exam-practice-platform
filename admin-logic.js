// ============================================================
// ADMIN-LOGIC.JS  — Unified header, sidebar nav, auto-lock
// ============================================================

// ── Default password ────────────────────────────────────────
if (!localStorage.getItem("adminGlobalPass")) {
    localStorage.setItem("adminGlobalPass", "1236");
}

// ── Hide page content instantly before DOM loads (prevent flash) ─
// Inject a blocking style so nothing is visible until auth is confirmed
(function () {
    if (localStorage.getItem("adminAuthenticated") !== "true") {
        const style = document.createElement("style");
        style.id = "__lockBodyStyle";
        style.textContent = "body > *:not(#adminAuthModal):not(#__lockVeil) { visibility: hidden !important; pointer-events: none !important; }";
        document.head
            ? document.head.appendChild(style)
            : document.addEventListener("DOMContentLoaded", () => document.head.appendChild(style));
    }
})();

// ── Auto-lock config ─────────────────────────────────────────
const AUTO_LOCK_MINUTES = 10;          // lock after 10 min idle
const WARN_BEFORE_SECONDS = 60;        // show warning 60 s before lock

// ── Detect current page ──────────────────────────────────────
function getCurrentPage() {
    const p = window.location.pathname;
    if (p.includes('register.html'))    return 'register';
    if (p.includes('manage_exams.html'))return 'manage';
    return 'admin';   // default = admin.html
}

// ── Page metadata ─────────────────────────────────────────────
const PAGE_META = {
    admin:    { title: 'Dashboard',       href: 'admin.html' },
    register: { title: 'Register Student',href: 'register.html' },
    manage:   { title: 'Manage Exams',    href: 'manage_exams.html' }
};

// ============================================================
// 1. INJECT HEADER + SIDEBAR
// ============================================================
function injectHeader() {
    const cur = getCurrentPage();

    const navItems = [
        { id: 'admin',    icon: '🏠', label: 'Dashboard',        href: 'admin.html' },
        { id: 'register', icon: '📝', label: 'Register Student', href: 'register.html' },
        { id: 'manage',   icon: '📋', label: 'Manage Exams',     href: 'manage_exams.html' }
    ];

    const navLinks = navItems.map(item => `
        <a href="${item.href}" class="sidebar-nav-link${item.id === cur ? ' current' : ''}">
            <span class="sn-icon">${item.icon}</span>
            <span>${item.label}</span>
        </a>`).join('');

    const html = `
    <!-- ═══ TOP HEADER ═══ -->
    <header class="admin-header" id="adminHeader">
        <div class="admin-logo-section">
            <button class="hamburger-btn" id="hamburgerBtn" aria-label="Menu" onclick="toggleSidebar()">
                <span></span><span></span><span></span>
            </button>
            <h2>Admin Portal</h2>
        </div>
        <div class="header-page-title">${PAGE_META[cur].title}</div>
        <div class="header-actions">
            <button class="admin-logout-btn" onclick="logoutAdmin()">Logout</button>
        </div>
    </header>

    <!-- ═══ SIDEBAR OVERLAY ═══ -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

    <!-- ═══ SIDEBAR ═══ -->
    <aside class="admin-sidebar" id="adminSidebar" aria-hidden="true">
        <div class="sidebar-top">
            <div class="sidebar-brand">
                <span class="sb-icon">🎓</span>
                <span>Admin Portal</span>
            </div>
            <button class="sidebar-close-btn" onclick="closeSidebar()" aria-label="Close menu">✕</button>
        </div>

        <nav class="sidebar-nav">${navLinks}</nav>

        <div class="sidebar-divider"></div>

        <div class="sidebar-footer">
            <button class="sb-action-btn security-btn"
                onclick="openPassModal(); closeSidebar()">
                🔑 Change Password
            </button>
            <button class="sb-action-btn logout-btn"
                onclick="logoutAdmin()">
                🔒 Logout
            </button>
        </div>

        <div class="sidebar-timer-info" id="sidebarTimerInfo">
            🕐 Auto-lock: <span id="sidebarTimerDisplay">–</span>
        </div>
    </aside>`;

    document.body.insertAdjacentHTML('afterbegin', html);
}

// ── Sidebar toggle ────────────────────────────────────────────
function toggleSidebar() {
    const sb  = document.getElementById('adminSidebar');
    const ov  = document.getElementById('sidebarOverlay');
    const ham = document.getElementById('hamburgerBtn');
    const open = sb.classList.toggle('open');
    ov.classList.toggle('visible', open);
    ham.classList.toggle('active', open);
    sb.setAttribute('aria-hidden', !open);
}
function closeSidebar() {
    const sb  = document.getElementById('adminSidebar');
    const ov  = document.getElementById('sidebarOverlay');
    const ham = document.getElementById('hamburgerBtn');
    sb.classList.remove('open');
    ov.classList.remove('visible');
    ham && ham.classList.remove('active');
    sb.setAttribute('aria-hidden', 'true');
}

// ============================================================
// 2. INJECT SECURITY MODALS
// ============================================================
function injectSecurityModals() {
    const html = `
    <!-- ═══ LOCK / AUTH MODAL ═══ -->
    <div id="adminAuthModal" class="admin-modal-overlay lock-screen" style="display:none;">
        <div class="admin-modal-content lock-modal-card">
            <div class="lock-icon" id="lockModalIcon">🔒</div>
            <h3 id="lockModalTitle">Admin Access</h3>
            <p id="lockModalSub">Enter your admin password to continue</p>
            <input type="password" id="adminPassInput"
                placeholder="Enter Admin Password" autocomplete="off">
            <p id="wrong" style="color:#ff4d4d;font-size:13px;display:none;margin-top:-12px;margin-bottom:8px;">
                ✗ Incorrect password. Access denied.
            </p>
            <div class="modal-footer">
                <button id="authSubmitBtn" class="btn-secondary upd">Unlock</button>
                <button onclick="exitToHome()" class="btn-secondary">Exit to Home</button>
            </div>
        </div>
    </div>

    <!-- ═══ CHANGE PASSWORD MODAL ═══ -->
    <div id="chgAdminPassModal" class="admin-modal-overlay" style="display:none;">
        <div class="admin-modal-content">
            <div class="lock-icon">🔑</div>
            <h3>Change Admin Password</h3>
            <input type="password" id="oldPassInput" placeholder="Current Password">
            <input type="password" id="newAdminPass" placeholder="New Password (min 4 chars)">
            <div id="droper" style="font-size:13px;min-height:18px;"></div>
            <div class="modal-footer" style="margin-top:15px;">
                <button onclick="updateAdminPassword()" class="btn-secondary upd">Update</button>
                <button onclick="closePassModal()" class="btn-secondary">Cancel</button>
            </div>
        </div>
    </div>

    <!-- ═══ AUTO-LOCK TOAST WARNING ═══ -->
    <div id="autoLockToast" class="auto-lock-toast" style="display:none;">
        <span>⚠️ Session auto-locking in</span>
        <strong id="lockCountdown">60</strong>
        <span>seconds of inactivity</span>
        <button onclick="resetActivityTimer()" class="toast-dismiss-btn">Stay Active</button>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
}

// ============================================================
// 3. AUTHENTICATION
// ============================================================
function checkAuth() {
    if (localStorage.getItem("adminAuthenticated") !== "true") {
        showLockScreen(false);  // false = first-visit (not auto-lock)
    }
}

function showLockScreen(isAutoLock) {
    const modal  = document.getElementById('adminAuthModal');
    const header = document.getElementById('adminHeader');
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    // Re-apply body veil so page content is hidden while locked
    let lockStyle = document.getElementById('__lockBodyStyle');
    if (!lockStyle) {
        lockStyle = document.createElement("style");
        lockStyle.id = "__lockBodyStyle";
        lockStyle.textContent = "body > *:not(#adminAuthModal):not(#__lockVeil) { visibility: hidden !important; pointer-events: none !important; }";
        document.head.appendChild(lockStyle);
    }

    // Hide header so logout / nav not accessible while locked
    if (header)  header.style.visibility = 'hidden';
    if (header)  header.style.pointerEvents = 'none';
    // Close sidebar if open
    if (sidebar) { sidebar.classList.remove('open'); sidebar.setAttribute('aria-hidden','true'); }
    if (overlay) overlay.classList.remove('visible');

    if (isAutoLock) {
        document.getElementById('lockModalIcon').textContent  = '⏰';
        document.getElementById('lockModalTitle').textContent = 'Session Locked';
        document.getElementById('lockModalSub').textContent   = 'Locked due to inactivity. Enter password to resume.';
    } else {
        document.getElementById('lockModalIcon').textContent  = '🔒';
        document.getElementById('lockModalTitle').textContent = 'Admin Access';
        document.getElementById('lockModalSub').textContent   = 'Enter your admin password to continue';
    }

    modal.style.display = 'flex';
    setTimeout(() => {
        const inp = document.getElementById('adminPassInput');
        if (inp) inp.focus();
    }, 120);
}

function unlockScreen() {
    const modal  = document.getElementById('adminAuthModal');
    const header = document.getElementById('adminHeader');

    // Remove the body-blocking style injected at page load
    const lockStyle = document.getElementById('__lockBodyStyle');
    if (lockStyle) lockStyle.remove();

    modal.style.display = 'none';
    if (header) { header.style.visibility = ''; header.style.pointerEvents = ''; }
    localStorage.setItem("adminAuthenticated", "true");
    resetActivityTimer();
}

function logoutAdmin() {
    clearActivityTimers();
    localStorage.removeItem("adminAuthenticated");

    // Re-apply body veil so content is hidden immediately
    let lockStyle = document.getElementById('__lockBodyStyle');
    if (!lockStyle) {
        lockStyle = document.createElement("style");
        lockStyle.id = "__lockBodyStyle";
        lockStyle.textContent = "body > *:not(#adminAuthModal):not(#__lockVeil) { visibility: hidden !important; pointer-events: none !important; }";
        document.head.appendChild(lockStyle);
    }

    showLockScreen(false);   // show the lock modal on the current page
}

function exitToHome() {
    clearActivityTimers();
    localStorage.removeItem("adminAuthenticated");
    window.location.href = "index.html";
}

// ── Password management ───────────────────────────────────────
function openPassModal() {
    document.getElementById('chgAdminPassModal').style.display = 'flex';
}
function closePassModal() {
    document.getElementById('chgAdminPassModal').style.display = 'none';
    document.getElementById('oldPassInput').value  = '';
    document.getElementById('newAdminPass').value  = '';
    document.getElementById('droper').innerText    = '';
}
function updateAdminPassword() {
    const stored  = localStorage.getItem("adminGlobalPass");
    const old     = document.getElementById('oldPassInput').value;
    const nw      = document.getElementById('newAdminPass').value;
    const msg     = document.getElementById('droper');

    if (old !== stored) {
        msg.style.color = '#ff4d4d';
        msg.textContent = '✗ Current password is incorrect.';
        return;
    }
    if (nw.length < 4) {
        msg.style.color = '#ff4d4d';
        msg.textContent = '✗ New password must be at least 4 characters.';
        return;
    }
    localStorage.setItem("adminGlobalPass", nw);
    msg.style.color      = '#2ecc71';
    msg.style.fontWeight = 'bold';
    msg.textContent      = '✓ Password updated successfully!';
    setTimeout(closePassModal, 1800);
}

// ============================================================
// 4. AUTO-LOCK TIMER
// ============================================================
let activityTimer    = null;
let warningTimer     = null;
let countdownInterval = null;

const LOCK_MS    = AUTO_LOCK_MINUTES * 60 * 1000;
const WARN_MS    = LOCK_MS - (WARN_BEFORE_SECONDS * 1000);

function clearActivityTimers() {
    clearTimeout(activityTimer);
    clearTimeout(warningTimer);
    clearInterval(countdownInterval);
}

function resetActivityTimer() {
    if (localStorage.getItem("adminAuthenticated") !== "true") return;

    clearActivityTimers();

    // Hide any visible toast
    const toast = document.getElementById('autoLockToast');
    if (toast) toast.style.display = 'none';

    // Update sidebar display
    updateSidebarTimer(AUTO_LOCK_MINUTES * 60);

    // Warning before lock
    if (WARN_MS > 0) {
        warningTimer = setTimeout(showAutoLockWarning, WARN_MS);
    }

    // Actual lock
    activityTimer = setTimeout(() => {
        const toast = document.getElementById('autoLockToast');
        if (toast) toast.style.display = 'none';
        clearInterval(countdownInterval);
        showLockScreen(true);
    }, LOCK_MS);

    // Sidebar countdown display (every second)
    let remaining = Math.round(LOCK_MS / 1000);
    clearInterval(window._sidebarCountdown);
    window._sidebarCountdown = setInterval(() => {
        remaining--;
        if (remaining <= 0) { clearInterval(window._sidebarCountdown); return; }
        updateSidebarTimer(remaining);
    }, 1000);
}

function updateSidebarTimer(seconds) {
    const el = document.getElementById('sidebarTimerDisplay');
    if (!el) return;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    el.textContent = m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function showAutoLockWarning() {
    const toast = document.getElementById('autoLockToast');
    if (!toast) return;
    toast.style.display = 'flex';

    let cd = WARN_BEFORE_SECONDS;
    document.getElementById('lockCountdown').textContent = cd;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        cd--;
        const el = document.getElementById('lockCountdown');
        if (el) el.textContent = cd;
        if (cd <= 0) clearInterval(countdownInterval);
    }, 1000);
}

// ── Activity tracking ─────────────────────────────────────────
function trackActivity() {
    ['mousedown','mousemove','keydown','scroll','touchstart','click'].forEach(evt => {
        document.addEventListener(evt, () => {
            if (localStorage.getItem("adminAuthenticated") === "true") {
                resetActivityTimer();
            }
        }, { passive: true });
    });
}

// ============================================================
// 5. INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectSecurityModals();
    checkAuth();
    trackActivity();

    if (localStorage.getItem("adminAuthenticated") === "true") {
        resetActivityTimer();
    }

    // ── Unlock button ──────────────────────────────────────────
    const authBtn = document.getElementById('authSubmitBtn');
    if (authBtn) {
        authBtn.onclick = attemptUnlock;
    }
    // Enter key on password field
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const modal = document.getElementById('adminAuthModal');
            if (modal && modal.style.display === 'flex') attemptUnlock();
        }
    });
});

function attemptUnlock() {
    const pass  = localStorage.getItem("adminGlobalPass");
    const input = document.getElementById('adminPassInput');
    const wrong = document.getElementById('wrong');

    if (input.value === pass) {
        wrong.style.display = 'none';
        input.value = '';
        unlockScreen();
    } else {
        wrong.style.display = 'block';
        input.value = '';
        input.focus();
        // Shake animation
        const card = document.querySelector('.lock-modal-card');
        if (card) {
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 500);
        }
    }
}
