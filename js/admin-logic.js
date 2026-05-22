// ============================================================
//  admin-logic.js  —  ADMIN SECURITY  (Firebase version)
// ============================================================

// 1. Inject Security Modals HTML (unchanged UI)
const securityHTML = `
<div id="adminAuthModal" class="admin-modal-overlay" style="display:none;">
    <div class="admin-modal-content">
        <div class="lock-icon">🔒</div>
        <h3>Admin Access</h3>
        <input type="password" id="adminPassInput" placeholder="Enter Admin Password">
        <p id="wrong" style="color: #ff4d4d; font-size: 13px; display: none;">Incorrect admin password. Access Denied</p>
        <div class="modal-footer">
            <button id="authSubmitBtn">Unlock</button>
            <button onclick="window.location.href='index.html'" class="btn-secondary">Exit</button>
        </div>
    </div>
</div>

<div id="chgAdminPassModal" class="admin-modal-overlay" style="display:none;">
    <div class="admin-modal-content">
        <div class="lock-icon">🔑</div>
        <h3>Change Admin Password</h3>
        <input type="password" id="oldPassInput"   placeholder="Current Password">
        <input type="password" id="newAdminPass"   placeholder="New Password">
        <div id="droper" style="color: #ff4d4d; font-size: 13px;"></div>
        <div class="modal-footer">
            <button onclick="updateAdminPassword()" class="btn-secondary upd">Update</button>
            <button onclick="closePassModal()"       class="btn-secondary">Cancel</button>
        </div>
    </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', securityHTML);

// 2. Load admin password from Firebase (falls back to "1236" if not set yet)
let adminGlobalPass = "1236";

async function loadAdminPass() {
    try {
        const snap = await db.ref("adminSettings/password").once("value");
        if (snap.exists()) {
            adminGlobalPass = snap.val();
        } else {
            // First run: write default
            await db.ref("adminSettings/password").set("1236");
        }
    } catch (err) {
        console.warn("Could not load admin password from Firebase, using default.", err);
    }
}

// 3. Authentication
function checkAuth() {
    const isAdminLoggedIn = localStorage.getItem("adminAuthenticated") === "true";
    const authModal       = document.getElementById('adminAuthModal');

    if (!isAdminLoggedIn) {
        if (authModal) {
            authModal.style.display = "flex";
            setTimeout(() => {
                const input = document.getElementById('adminPassInput');
                if (input) input.focus();
            }, 100);
        } else {
            window.location.href = "index.html";
        }
    } else if (authModal) {
        authModal.style.display = "none";
    }
}

function lockAdmin() {
    localStorage.removeItem("adminAuthenticated");
    window.location.href = "index.html";
}

// 4. Change admin password modal
function openPassModal() {
    document.getElementById('chgAdminPassModal').style.display = 'flex';
}

function closePassModal() {
    document.getElementById('chgAdminPassModal').style.display = 'none';
    document.getElementById('oldPassInput').value = "";
    document.getElementById('newAdminPass').value = "";
    document.getElementById('droper').innerText   = "";
}

async function updateAdminPassword() {
    const oldInput  = document.getElementById('oldPassInput').value;
    const newInput  = document.getElementById('newAdminPass').value;
    const sender    = document.getElementById("droper");

    if (oldInput !== adminGlobalPass) {
        sender.style.color  = "#ff4d4d";
        sender.innerHTML    = "Current password incorrect!";
        return;
    }
    if (newInput.length < 4) {
        sender.style.color  = "#ff4d4d";
        sender.innerHTML    = "New password must be at least 4 digits!";
        return;
    }

    try {
        await db.ref("adminSettings/password").set(newInput);
        adminGlobalPass     = newInput;
        sender.style.color  = "green";
        sender.style.fontWeight = "bold";
        sender.innerText    = "Success! Password updated.";
        setTimeout(closePassModal, 2000);
    } catch (err) {
        sender.style.color  = "#ff4d4d";
        sender.innerText    = "Failed to save. Check your connection.";
    }
}

// 5. Init
document.addEventListener('DOMContentLoaded', async () => {
    await loadAdminPass();
    checkAuth();

    const authBtn = document.getElementById('authSubmitBtn');
    if (authBtn) {
        authBtn.onclick = function () {
            const input = document.getElementById('adminPassInput');
            const wrong = document.getElementById('wrong');

            if (input.value === adminGlobalPass) {
                localStorage.setItem("adminAuthenticated", "true");
                document.getElementById('adminAuthModal').style.display = "none";
            } else {
                wrong.style.display = "flex";
                input.value         = "";
                input.focus();
            }
        };
    }
});
