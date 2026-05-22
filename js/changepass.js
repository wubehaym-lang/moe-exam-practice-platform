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

    // Per-field error spans that actually exist in the HTML
    const errCurrent = document.getElementById("err-currentPass");
    const errNew     = document.getElementById("err-newPass");
    const errConfirm = document.getElementById("err-confirmPass");

    // Clear all error messages first
    [errCurrent, errNew, errConfirm].forEach(el => {
        if (el) { el.innerText = ""; el.style.color = "red"; }
    });

    // Validate current password
    if (currentPassInput !== currentUser.password) {
        errCurrent.innerText = "Current password is incorrect.";
        return;
    }

    // Validate length
    if (newPassInput.length < 8) {
        errNew.style.color = "orange";
        errNew.innerText   = "New password must be at least 8 characters long.";
        return;
    }

    // Validate match
    if (newPassInput !== confirmPassInput) {
        errConfirm.innerText = "New passwords do not match.";
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
        document.getElementById("chgPassbx").style.display      = "none";
        document.querySelector(".success-container").style.display = "flex";

    } catch (err) {
        console.error("Password change error:", err);
        errNew.style.color = "red";
        errNew.innerText   = "Failed to save. Check your connection and try again.";
    }
});

// --- Continue button ---
document.getElementById("continueToHome").addEventListener("click", function () {
    window.location.href = "course.html";
});
