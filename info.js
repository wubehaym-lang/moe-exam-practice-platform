// This function builds the Header and the Dropdown Menu on every page
function loadHead() {
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    
    // Determine where the "My exam" link should go based on password status
    // If changed, go to course.html. If not, force them to chgpss.html.
    const examTarget = user.passwordChanged ? "course.html" : "Change_Password.html";

    const head = `
        <div class="ipic">
            <div class="logo-placeholder">
                <img src="icon/logo.jpg">
            </div>
            <nav class="nav-links">
                <a href="Change_Password.html" class="headlk ">Home</a>
                <a href="${examTarget}" class="headlk " >My exam</a>
            </nav>
        </div>
        <div class="user-menu" id="listMenu" style="cursor:pointer;">
            <div class="Hdrbox">
                <div class="avatar" id="short"></div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
        </div>

        <div class="menu" id="menuBx">
            <ul>
                <li><a href="course.html" style="text-decoration:none; color:inherit;">Profile</a></li>
                <li >Grade</li>
                <li style="border-top: 1px solid #ddd;"><a href="Change_Password.html" style="text-decoration:none; color:inherit;">Preferences</a></li>
                <li id="logoutBtn">Log out</li>
            </ul>
        </div>
    `;

    document.getElementById("come").innerHTML = head;

    // Your new active link logic can go right here!
// --- UPDATED ACTIVE LINK LOGIC ---
    const currentPath = window.location.pathname.toLowerCase(); 
    const navLinks = document.querySelectorAll('.headlk');

    // Remove active class from everyone first
    navLinks.forEach(link => link.classList.remove('active'));

    // Highlight "Home" if on Change_Password.html
    if (currentPath.includes('Change_Password.html')) {
        if (navLinks[0]) navLinks[0].classList.add('active');
    } 
    // Highlight "My exam" if on any exam-related page
    else if (currentPath.includes('course') || currentPath.includes('View') || currentPath.includes('exam')) {
        if (navLinks[1]) navLinks[1].classList.add('active');
    }
        // Toggle Logic
        const listMenu = document.getElementById('listMenu');
        const menu = document.getElementById('menuBx');
        
        if (listMenu && menu) {
            listMenu.addEventListener('click', function(e) {
                e.stopPropagation();
                menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
            });
            document.addEventListener('click', () => menu.style.display = 'none');
        }

        // Logout Logic
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
                
                
                // Inside your logout function in info.js
document.getElementById('logoutBtn').addEventListener('click', function() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        // This is the important part:
        localStorage.removeItem('examUnlocked_' + user.username);
    }  
});
            });
        }

        // Initials Logic (Safe Check)
        if (user.fullName) {
            updateAvatars(user.fullName);
        }
    
}

// This function fills the "Basic Information" box
function loadInfoPanel() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    
    // If no user is logged in, redirect to login page immediately
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const panel = `
        <div class="info-container">
            <div class="info-header">Basic Information</div>
            <div class="info-grid">
                <div class="grid-item"><span class="label">Full Name:</span> <span class="value">${user.fullName || ""}</span></div>
                <div class="grid-item"><span class="label">School:</span> <span class="value">${user.school || ""}</span></div>
                <div class="grid-item"><span class="label">Is Blind / Is Deaf:</span> <span class="value">${user.deaf || ""}/${user.blined || ""}</span></div>
                <div class="grid-item"><span class="label">Admission Number:</span> <span class="value">${user.username || ""}</span></div>
                <div class="grid-item"><span class="label">Exam Center:</span> <span class="value">${user.center || ""}</span></div>
                <div class="grid-item"><span class="label">Enrollment Type:</span> <span class="value">${user.type || ""}</span></div>
            </div>
        </div>
    `;

    const container = document.getElementById("info-panel-container");
    if (container) container.innerHTML = panel;
}

function updateAvatars(fullName) {
    if (!fullName) return;
    const parts = fullName.trim().split(" ");
    let initials = "";
    if (parts.length >= 2) {
        initials = parts[0][0] + parts[parts.length - 1][0];
    } else {
        initials = parts[0][0];
    }
    
    // Update ALL elements with class 'avatar' or id 'short'
    const avatars = document.querySelectorAll('.avatar, #short');
    avatars.forEach(el => {
        el.innerText = initials.toUpperCase();
    });
}
        document.getElementById('logoutBtn').addEventListener('click', function() {
    // 1. Remove the current user so the browser forgets who is logged in
    localStorage.removeItem("currentUser");
    
    // 2. Clear any temporary exam data (like selected answers)
    sessionStorage.clear();
    
    // 3. Send them back to the login screen
    window.location.href = "index.html";
});