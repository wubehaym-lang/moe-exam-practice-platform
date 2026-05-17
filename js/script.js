// LOGIN — uses server database via API
// api.js must be loaded before this script in index.html

document.getElementById("loginBtn").addEventListener("click", async function () {
  const errorText   = document.getElementById("errorText");
  const entereduser = document.getElementById("username").value.trim();
  const enteredpass = document.getElementById("password").value.trim();

  if (!entereduser || !enteredpass) {
      errorText.innerText = "Please enter username and password.";
      return;
  }

  // Show loading state
  errorText.style.color  = "#aaa";
  errorText.innerText    = "Checking...";

  const result = await API.login(entereduser, enteredpass);

  if (!result.success) {
      errorText.style.color = "red";
      errorText.innerText   = result.message || "Invalid username or password.";
      return;
  }

  if (result.isAdmin) {
      // Admin login — store flag in sessionStorage (not shared between computers)
      sessionStorage.setItem("isAdmin", "true");
      window.location.href = "admin.html";
      return;
  }

  // Student login — save to sessionStorage (per-tab, cleared when browser closes)
  API.setCurrentUser(result.user);

  if (result.user.passwordChanged) {
      window.location.href = "course.html";
  } else {
      window.location.href = "Change_Password.html";
  }
});
