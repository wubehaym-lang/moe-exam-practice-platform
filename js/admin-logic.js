
// ============================================================
// ADMIN-LOGIC.JS  — header, sidebar, theme, auth lock
// ============================================================


(function () {
  if (localStorage.getItem("adminAuthenticated") !== "true") {
    const style = document.createElement("style");
    style.id = "__lockBodyStyle";
    style.textContent = "body > *:not(#adminAuthModal):not(#__lockVeil) { visibility: hidden !important; pointer-events: none !important; }";
    document.head ? document.head.appendChild(style) : document.addEventListener("DOMContentLoaded", () => document.head.appendChild(style));
    document.documentElement.classList.add("admin-locked");
  }
})();

if (!localStorage.getItem("adminGlobalPass")) {
  localStorage.setItem("adminGlobalPass", "1236");
}

const AUTO_LOCK_MINUTES = 10;
const WARN_BEFORE_SECONDS = 60;

function getCurrentPage() {
  const p = window.location.pathname;
  if (p.includes("register.html")) return "register";
  if (p.includes("manage_exams.html")) return "manage";
  return "admin";
}

const PAGE_META = {
  admin: { title: "Dashboard", href: "admin.html" },
  register: { title: "Register Student", href: "register.html" },
  manage: { title: "Manage Exams", href: "manage_exams.html" }
};

function applyTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  document.body.classList.toggle("theme-dark", next === "dark");
  document.body.classList.toggle("theme-light", next === "light");
  localStorage.setItem("adminTheme", next);
  const btn = document.getElementById("themeToggleBtn");
  if (btn) btn.textContent = next === "dark" ? "☾" : "☀";
}

function toggleTheme() {
  const current = localStorage.getItem("adminTheme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
}

function injectHeader() {
  const cur = getCurrentPage();
  const navItems = [
    { id: "admin", icon: "🏠", label: "Dashboard", href: "admin.html" },
    { id: "register", icon: "📝", label: "Register Student", href: "register.html" },
    { id: "manage", icon: "📋", label: "Manage Exams", href: "manage_exams.html" }
  ];

  const navLinks = navItems.map(item => `
    <a href="${item.href}" class="sidebar-nav-link${item.id === cur ? " current" : ""}">
      <span class="sn-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `).join("");

  const html = `
    <header class="admin-header" id="adminHeader">
      <div class="admin-logo-section">
        <button class="hamburger-btn" id="hamburgerBtn" aria-label="Menu" onclick="toggleSidebar()">
          <span></span><span></span><span></span>
        </button>
        <h2>Admin Portal</h2>
      </div>
      <div class="header-page-title">${PAGE_META[cur].title}</div>
      <div class="header-actions">
        <button class="theme-toggle-btn" id="themeToggleBtn" onclick="toggleTheme()" aria-label="Toggle theme">☾</button>
        <button class="admin-logout-btn" onclick="logoutAdmin()">Logout</button>
      </div>
    </header>

    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

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
        <button class="sb-action-btn security-btn" onclick="openPassModal(); closeSidebar()">🔑 Change Password</button>
        <button class="sb-action-btn logout-btn" onclick="logoutAdmin()">🔒 Logout</button>
      </div>

      <div class="sidebar-timer-info" id="sidebarTimerInfo">
        🕐 Auto-lock: <span id="sidebarTimerDisplay">–</span>
      </div>
    </aside>
  `;

  document.body.insertAdjacentHTML("afterbegin", html);
}

function toggleSidebar() {
  const sb = document.getElementById("adminSidebar");
  const ov = document.getElementById("sidebarOverlay");
  const ham = document.getElementById("hamburgerBtn");
  if (!sb || !ov || !ham) return;
  const open = sb.classList.toggle("open");
  ov.classList.toggle("visible", open);
  ham.classList.toggle("active", open);
  sb.setAttribute("aria-hidden", String(!open));
}

function closeSidebar() {
  const sb = document.getElementById("adminSidebar");
  const ov = document.getElementById("sidebarOverlay");
  const ham = document.getElementById("hamburgerBtn");
  if (sb) {
    sb.classList.remove("open");
    sb.setAttribute("aria-hidden", "true");
  }
  if (ov) ov.classList.remove("visible");
  if (ham) ham.classList.remove("active");
}

function injectSecurityModals() {
  const html = `
    <div id="adminAuthModal" class="admin-modal-overlay lock-screen" style="display:none;">
      <div class="admin-modal-content lock-modal-card">
        <div class="lock-icon" id="lockModalIcon">🔒</div>
        <h3 id="lockModalTitle">Admin Access</h3>
        <p id="lockModalSub">Enter your admin password to continue</p>
        <input type="password" id="adminPassInput" placeholder="Enter Admin Password" autocomplete="off">
        <p id="wrong" style="color:#d94b4b;font-size:13px;display:none;margin-top:-6px;margin-bottom:6px;">
          ✗ Incorrect password. Access denied.
        </p>
        <div class="modal-footer">
          <button id="authSubmitBtn" class="btn-secondary upd">Unlock</button>
          <button onclick="exitToHome()" class="btn-secondary">Exit to Home</button>
        </div>
      </div>
    </div>

    <div id="chgAdminPassModal" class="admin-modal-overlay" style="display:none;">
      <div class="admin-modal-content">
        <div class="lock-icon">🔑</div>
        <h3>Change Admin Password</h3>
        <input type="password" id="oldPassInput" placeholder="Current Password">
        <input type="password" id="newAdminPass" placeholder="New Password (min 4 chars)">
        <div id="droper" style="font-size:13px;min-height:18px;color:var(--muted);"></div>
        <div class="modal-footer">
          <button onclick="updateAdminPassword()" class="btn-secondary upd">Update</button>
          <button onclick="closePassModal()" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <div id="autoLockToast" class="auto-lock-toast" style="display:none;">
      <span>⚠️ Session auto-locking in</span>
      <strong id="lockCountdown">60</strong>
      <span>seconds of inactivity</span>
      <button onclick="resetActivityTimer()" class="toast-dismiss-btn">Stay Active</button>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);
}

function ensureLockStyle() {
  let lockStyle = document.getElementById("__lockBodyStyle");
  if (!lockStyle) {
    lockStyle = document.createElement("style");
    lockStyle.id = "__lockBodyStyle";
    lockStyle.textContent = "body > *:not(#adminAuthModal):not(#__lockVeil) { visibility: hidden !important; pointer-events: none !important; }";
    document.head.appendChild(lockStyle);
  }
  document.documentElement.classList.add("admin-locked");
}

function removeLockStyle() {
  const lockStyle = document.getElementById("__lockBodyStyle");
  if (lockStyle) lockStyle.remove();
  document.documentElement.classList.remove("admin-locked");
}

function checkAuth() {
  if (localStorage.getItem("adminAuthenticated") !== "true") {
    showLockScreen(false);
  } else {
    removeLockStyle();
  }
}

function showLockScreen(isAutoLock) {
  const modal = document.getElementById("adminAuthModal");
  const header = document.getElementById("adminHeader");
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("sidebarOverlay");

  ensureLockStyle();

  if (header) {
    header.style.visibility = "hidden";
    header.style.pointerEvents = "none";
  }
  if (sidebar) {
    sidebar.classList.remove("open");
    sidebar.setAttribute("aria-hidden", "true");
  }
  if (overlay) overlay.classList.remove("visible");

  const icon = document.getElementById("lockModalIcon");
  const title = document.getElementById("lockModalTitle");
  const sub = document.getElementById("lockModalSub");

  if (isAutoLock) {
    if (icon) icon.textContent = "⏰";
    if (title) title.textContent = "Session Locked";
    if (sub) sub.textContent = "Locked due to inactivity. Enter password to resume.";
  } else {
    if (icon) icon.textContent = "🔒";
    if (title) title.textContent = "Admin Access";
    if (sub) sub.textContent = "Enter your admin password to continue";
  }

  if (modal) modal.style.display = "flex";
  setTimeout(() => {
    const inp = document.getElementById("adminPassInput");
    if (inp) inp.focus();
  }, 120);
}

function unlockScreen() {
  const modal = document.getElementById("adminAuthModal");
  const header = document.getElementById("adminHeader");
  removeLockStyle();
  if (modal) modal.style.display = "none";
  if (header) {
    header.style.visibility = "";
    header.style.pointerEvents = "";
  }
  localStorage.setItem("adminAuthenticated", "true");
  resetActivityTimer();
}

function logoutAdmin() {
  clearActivityTimers();
  localStorage.removeItem("adminAuthenticated");
  window.location.href = "index.html";
}

async function exitToHome() {
  clearActivityTimers();
  localStorage.removeItem("adminAuthenticated");
  await waitForSync();
  window.location.href = "index.html";
}

function openPassModal() {
  const modal = document.getElementById("chgAdminPassModal");
  if (modal) modal.style.display = "flex";
}

function closePassModal() {
  const modal = document.getElementById("chgAdminPassModal");
  if (modal) modal.style.display = "none";
  const oldP = document.getElementById("oldPassInput");
  const newP = document.getElementById("newAdminPass");
  const msg = document.getElementById("droper");
  if (oldP) oldP.value = "";
  if (newP) newP.value = "";
  if (msg) msg.innerText = "";
}

async function waitForSync() {
  if (window.appwriteMirrorReady) {
    await window.appwriteMirrorReady;
  }
  if (window.appwriteMirror && typeof window.appwriteMirror.waitForWrites === "function") {
    await window.appwriteMirror.waitForWrites();
  }
}

function showSaving(message = "Saving") {
  if (window.appwriteMirror && window.appwriteMirror.showSaving) {
    window.appwriteMirror.showSaving(message);
  }
}

function hideSaving() {
  if (window.appwriteMirror && window.appwriteMirror.hideSaving) {
    window.appwriteMirror.hideSaving();
  }
}

async function updateAdminPassword() {
  const stored = localStorage.getItem("adminGlobalPass");
  const old = document.getElementById("oldPassInput").value;
  const nw = document.getElementById("newAdminPass").value;
  const msg = document.getElementById("droper");

  if (old !== stored) {
    msg.style.color = "#d94b4b";
    msg.textContent = "✗ Current password is incorrect.";
    return;
  }
  if (nw.length < 4) {
    msg.style.color = "#d94b4b";
    msg.textContent = "✗ New password must be at least 4 characters.";
    return;
  }

  localStorage.setItem("adminGlobalPass", nw);
  showSaving("Updating password");
  await waitForSync();
  hideSaving();
  msg.style.color = "#1f9d63";
  msg.style.fontWeight = "700";
  msg.textContent = "✓ Password updated successfully!";
  setTimeout(closePassModal, 1400);
}

let activityTimer = null;
let warningTimer = null;
let countdownInterval = null;

const LOCK_MS = AUTO_LOCK_MINUTES * 60 * 1000;
const WARN_MS = LOCK_MS - (WARN_BEFORE_SECONDS * 1000);

function clearActivityTimers() {
  clearTimeout(activityTimer);
  clearTimeout(warningTimer);
  clearInterval(countdownInterval);
  clearInterval(window._sidebarCountdown);
}

function updateSidebarTimer(seconds) {
  const el = document.getElementById("sidebarTimerDisplay");
  if (!el) return;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  el.textContent = m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function showAutoLockWarning() {
  const toast = document.getElementById("autoLockToast");
  if (!toast) return;
  toast.style.display = "flex";

  let cd = WARN_BEFORE_SECONDS;
  const el = document.getElementById("lockCountdown");
  if (el) el.textContent = cd;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    cd--;
    if (el) el.textContent = cd;
    if (cd <= 0) clearInterval(countdownInterval);
  }, 1000);
}

function resetActivityTimer() {
  if (localStorage.getItem("adminAuthenticated") !== "true") return;

  clearActivityTimers();

  const toast = document.getElementById("autoLockToast");
  if (toast) toast.style.display = "none";

  updateSidebarTimer(AUTO_LOCK_MINUTES * 60);

  if (WARN_MS > 0) {
    warningTimer = setTimeout(showAutoLockWarning, WARN_MS);
  }

  activityTimer = setTimeout(() => {
    const toast = document.getElementById("autoLockToast");
    if (toast) toast.style.display = "none";
    showLockScreen(true);
  }, LOCK_MS);

  let remaining = Math.round(LOCK_MS / 1000);
  window._sidebarCountdown = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(window._sidebarCountdown);
      return;
    }
    updateSidebarTimer(remaining);
  }, 1000);
}

function trackActivity() {
  ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"].forEach(evt => {
    document.addEventListener(evt, () => {
      if (localStorage.getItem("adminAuthenticated") === "true") {
        resetActivityTimer();
      }
    }, { passive: true });
  });
}

function attemptUnlock() {
  const pass = localStorage.getItem("adminGlobalPass");
  const input = document.getElementById("adminPassInput");
  const wrong = document.getElementById("wrong");

  if (!input) return;
  if (input.value === pass) {
    if (wrong) wrong.style.display = "none";
    input.value = "";
    unlockScreen();
  } else {
    if (wrong) wrong.style.display = "block";
    input.value = "";
    input.focus();
    const card = document.querySelector(".lock-modal-card");
    if (card) {
      card.classList.add("shake");
      setTimeout(() => card.classList.remove("shake"), 500);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches && !localStorage.getItem("adminTheme")) {
    localStorage.setItem("adminTheme", "dark");
  }
  applyTheme(localStorage.getItem("adminTheme") || "dark");

  injectHeader();
  injectSecurityModals();
  checkAuth();
  trackActivity();

  if (localStorage.getItem("adminAuthenticated") === "true") {
    resetActivityTimer();
  }

  const authBtn = document.getElementById("authSubmitBtn");
  if (authBtn) authBtn.onclick = attemptUnlock;

  document.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const modal = document.getElementById("adminAuthModal");
      if (modal && modal.style.display === "flex") attemptUnlock();
    }
  });
});

window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.openPassModal = openPassModal;
window.closePassModal = closePassModal;
window.logoutAdmin = logoutAdmin;
window.exitToHome = exitToHome;
window.updateAdminPassword = updateAdminPassword;
window.resetActivityTimer = resetActivityTimer;
window.toggleTheme = toggleTheme;
