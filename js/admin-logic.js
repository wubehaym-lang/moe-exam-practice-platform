// --- DATABASE & AUTH CONFIG ---
if (!localStorage.getItem("adminGlobalPass")) {
    localStorage.setItem("adminGlobalPass", "1236"); // Default password
}

// 1. Inject Security Modals HTML into the page automatically
const securityHTML = `
<div id="adminAuthModal" class="admin-modal-overlay" style="display:none;">
    <div class="admin-modal-content">
        <div class="lock-icon">🔒</div>
        <h3>Admin Access</h3>
        <input type="password" id="adminPassInput" placeholder="Enter Admin Password">
        <p id="wrong" style="color: #ff4d4d; font-size: 13px; display: none;"> Incorrect admin password. Access Denied</p>
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
        <input type="password" id="oldPassInput" placeholder="Current Password">
        <input type="password" id="newAdminPass" placeholder="New Password">
        <div id="droper" style="color: #ff4d4d; font-size: 13px;"></div>
        <div class="modal-footer">
            <button onclick="updateAdminPassword()" class="btn-secondary upd">Update</button>
            <button onclick="closePassModal()" class="btn-secondary">Cancel</button>
        </div>
    </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', securityHTML);

// 2. Authentication logic
function checkAuth() {
    const isAdminLoggedIn = localStorage.getItem("adminAuthenticated") === "true";
    const authModal = document.getElementById('adminAuthModal');
    
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

// 3. Password Management logic
function openPassModal() {
    document.getElementById('chgAdminPassModal').style.display = 'flex';
}

function closePassModal() {
    document.getElementById('chgAdminPassModal').style.display = 'none';
    document.getElementById('oldPassInput').value = "";
    document.getElementById('newAdminPass').value = "";
    document.getElementById('droper').innerText = "";
}

function updateAdminPassword() {
    const currentStoredPass = localStorage.getItem("adminGlobalPass");
    const oldInput = document.getElementById('oldPassInput').value;
    const newInput = document.getElementById('newAdminPass').value;
    const sender = document.getElementById("droper");

    if (oldInput !== currentStoredPass) {
        sender.style.color = "#ff4d4d";
        sender.innerHTML = "Current password incorrect!";
        return;
    }
    if (newInput.length < 4) {
        sender.style.color = "#ff4d4d";
        sender.innerHTML = "New password must be at least 4 digits!";
        return;
    }

    localStorage.setItem("adminGlobalPass", newInput);
    sender.style.color = "green";
    sender.style.fontWeight = "bold";
    sender.innerText = "Success! Password updated.";
    setTimeout(closePassModal, 2000);
}

// 4. Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const authBtn = document.getElementById('authSubmitBtn');
    if (authBtn) {
        authBtn.onclick = function() {
            const globalPass = localStorage.getItem("adminGlobalPass");
            const input = document.getElementById('adminPassInput');
            const wrong = document.getElementById('wrong');
            
            if (input.value === globalPass) {
                localStorage.setItem("adminAuthenticated", "true");
                document.getElementById('adminAuthModal').style.display = "none";
            } else {
                wrong.style.display = "flex";
                input.value = "";
                input.focus();
            }
        };
    }
});
