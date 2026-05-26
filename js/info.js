// Shared name helpers used across the app
function splitUserName(fullName) {
    const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
    return parts;
}

function getDisplayName(fullName) {
    const parts = splitUserName(fullName);
    if (parts.length >= 2) {
        return `${parts[0]} ${parts[1]}`;
    }
    return parts[0] || "";
}

function getNameInitials(fullName) {
    const parts = splitUserName(fullName);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }
    return "";
}

// Build the Header and Dropdown Menu on every page
function loadHead() {
    const user = window.getCurrentUser ? (window.getCurrentUser() || {}) : (JSON.parse(sessionStorage.getItem("currentUser") || "null") || {});
    const examTarget = user.passwordChanged ? "course.html" : "change-password.html";

    const head = `
        <div class="ipic">
            <div class="logo-placeholder">
                <img src="icon/logo.jpg" alt="Logo">
            </div>
            <nav class="nav-links">
                <a href="course.html" class="headlk">Home</a>
                <a href="${examTarget}" class="headlk">My exam</a>
            </nav>
        </div>
        <div class="user-menu" id="listMenu" style="cursor:pointer;">
            <div class="Hdrbox">
                <div class="avatar" id="short"></div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
        </div>

        <div class="menu" id="menuBx" style="display:none;">
            <ul>
                <li><a href="course.html" style="text-decoration:none; color:inherit;">Profile</a></li>
                <li>Grade</li>
                <li>Calendar</li>
                <li>Private files</li>
                <li>Reports</li>
                <li>Preferences</li>
                <li id="logoutBtn">Log out</li>
            </ul>
        </div>
    `;

    const come = document.getElementById("come");
    if (come) come.innerHTML = head;

    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.headlk');
    navLinks.forEach(link => link.classList.remove('active'));

    if (currentPath.includes('change-password.html')) {
        if (navLinks[0]) navLinks[0].classList.add('active');
    } else if (currentPath.includes('course') || currentPath.includes('view') || currentPath.includes('exam')) {
        if (navLinks[1]) navLinks[1].classList.add('active');
    }

    const listMenu = document.getElementById('listMenu');
    const menu = document.getElementById('menuBx');

    if (listMenu && menu) {
        listMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
        });
        document.addEventListener('click', () => {
            menu.style.display = 'none';
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const currentUser = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(sessionStorage.getItem("currentUser") || "null");
            if (currentUser && currentUser.username) {
                localStorage.removeItem('examUnlocked_' + currentUser.username);
            }
            window.clearCurrentUser ? window.clearCurrentUser() : sessionStorage.removeItem("currentUser");
            sessionStorage.clear();
            window.location.href = "index.html";
        });
    }

    if (user.fullName) {
        updateAvatars(user.fullName);
    }
}

// This function fills the "Basic Information" box
function loadInfoPanel() {
    const user = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(sessionStorage.getItem("currentUser") || "null");
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const panel = `
        <div class="whole">
            <div class="imagebx">
               <div class="both">
                <p>Profile Picture</p>
                <div class="real">
                    <div class="image">${getNameInitials(user.fullName) || "WH"}</div>
                </div>
               </div>
            </div>
            <table>
              <thead>
                <tr><th colspan="4" style=" color: #fff; text-align:center; background: var(--primary-blue);">Basic Information</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Full Name:</td>
                  <td>${getDisplayName(user.fullName) || ""}</td>
                  <td>Institution</td>
                  <td>${user.school || ""}</td>
                </tr>
                <tr>
                  <td>Is Blind / Is Deaf:</td>
                  <td>${user.deaf || ""}/${user.blined || ""}</td>
                  <td>Username:</td>
                  <td>${user.username || ""}</td>
                </tr>
                <tr>
                  <td>Exam Center:</td>
                  <td>${user.center || ""}</td>
                  <td>Enrolment Type</td>
                  <td>${user.type || ""}</td>
                </tr>
                <tr>
                  <td>Department</td>
                  <td>${user.stream || ""}</td>
                  <td>Gender</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
        </div>
    `;

    const container = document.getElementById("info-panel-container");
    if (container) container.innerHTML = panel;
}

function updateAvatars(fullName) {
    const initials = getNameInitials(fullName);
    if (!initials) return;

    document.querySelectorAll('.avatar, #short').forEach(el => {
        el.innerText = initials;
    });
}

// ── Student heartbeat — updates live status every 60 seconds ──
// The admin panel reads userLogintime_<username> to check if the
// student is currently online (within the last 3 minutes).
function startHeartbeat() {
    const user = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(sessionStorage.getItem("currentUser") || "null");
    if (!user || !user.username) return;

    function beat() {
        localStorage.setItem("userLogintime_" + user.username, Date.now().toString());
    }

    beat();                              // write immediately on page load
    setInterval(beat, 60 * 1000);       // then every 60 seconds
}

// Auto-start if we can find the current user
(function () {
    // Small delay to let appwrite-sync hydrate first
    setTimeout(startHeartbeat, 1500);
})();
