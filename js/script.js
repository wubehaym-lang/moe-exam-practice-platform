// ============================================================
//  script.js  —  LOGIN PAGE  (Firebase version)
// ============================================================

document.getElementById("loginBtn").addEventListener("click", async function () {
  const errorText  = document.getElementById("errorText");
  const message    = document.getElementById("message");
  const enteredUser = document.getElementById("username").value.trim();
  const enteredPass = document.getElementById("password").value.trim();

  // --- 1. Admin shortcut (still local, no need to hit Firebase) ---
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "1234";

  if (enteredUser === ADMIN_USERNAME && enteredPass === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    window.location.href = "admin.html";
    return;
  }

  // --- 2. Look up the student in Firebase ---
  try {
    const snapshot = await db.ref("users/" + enteredUser).once("value");

    if (!snapshot.exists()) {
      message.style.display   = "flex";
      errorText.style.display = "flex";
      errorText.innerText     = "User not found. Not registered yet.";
      return;
    }

    const foundUser = snapshot.val();

    if (foundUser.password !== enteredPass) {
      message.style.display   = "flex";
      errorText.style.display = "flex";
      errorText.innerText     = "Invalid login, please try again";
      return;
    }

    // --- 3. Update login timestamps ---
    const options = {
      weekday: 'long', day: 'numeric', month: 'long',
      year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    };
    const now = new Date().toLocaleString('en-GB', options);

    await db.ref("users/" + enteredUser).update({
      lastLogin:    foundUser.currentLogin || "First time access",
      currentLogin: now
    });

    // Refresh local copy with updated timestamps
    foundUser.lastLogin    = foundUser.currentLogin || "First time access";
    foundUser.currentLogin = now;

    // --- 4. Store logged-in user locally for session use ---
    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    // --- 5. Redirect ---
    if (foundUser.passwordChanged) {
      window.location.href = "course.html";
    } else {
      window.location.href = "change-password.html";
    }

  } catch (err) {
    console.error("Login error:", err);
    message.style.display   = "flex";
    errorText.style.display = "flex";
    errorText.innerText     = "Connection error. Check your internet and try again.";
  }
});
