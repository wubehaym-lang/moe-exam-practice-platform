// ============================================================
//  changepass.js  —  CHANGE PASSWORD PAGE  (Firebase version)
// ============================================================

// --- Display the current user info on load ---
const user = JSON.parse(localStorage.getItem("currentUser"));
if (user) {
    document.getElementById("codeDisplay").innerText  = user.username;
    document.getElementById("nameTitle").innerText    = user.fullName.toUpperCase();
    updateAvatars(user.fullName);
}

// --- Save button ---
document.getElementById("saveBtn").addEventListener("click", async function () {
    const currentUser      = JSON.parse(localStorage.getItem("currentUser"));
    const currentPassInput = document.getElementById("currentPass").value;
    const newPassInput     = document.getElementById("newPass").value;
    const confirmPassInput = document.getElementById("confirmPass").value;
    const chage            = document.getElementById("chage");

    // Validate current password
    if (currentPassInput !== currentUser.password) {
        chage.style.color = "red";
        chage.innerText   = "Current password is incorrect.";
        return;
    }

    // Validate length
    if (newPassInput.length < 8) {
        chage.style.color = "orange";
        chage.innerText   = "New password must be at least 8 characters long.";
        return;
    }

    // Validate match
    if (newPassInput !== confirmPassInput) {
        chage.style.color = "red";
        chage.innerText   = "New passwords do not match.";
        return;
    }

    // --- SUCCESS: update Firebase ---
    try {
        await db.ref("users/" + currentUser.username).update({
            password:        newPassInput,
            passwordChanged: true
        });

        // Update local session copy
        currentUser.password        = newPassInput;
        currentUser.passwordChanged = true;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // Show success screen
        document.getElementById("chgPassbx").style.display               = "none";
        document.querySelector(".success-container").style.display = "flex";

    } catch (err) {
        console.error("Password change error:", err);
        chage.style.color = "red";
        chage.innerText   = "Failed to save. Check your connection and try again.";
    }
});

// --- Continue button ---
document.getElementById("continueToHome").addEventListener("click", function () {
    window.location.href = "course.html";
});
