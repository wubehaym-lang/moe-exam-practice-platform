document.getElementById("loginBtn").addEventListener("click", async function () {
  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  const errorText = document.getElementById("errorText");
  const message = document.getElementById("message");
  const entereduser = document.getElementById("username").value;
  const enteredpass = document.getElementById("password").value;

  const adminPassword = localStorage.getItem("adminGlobalPass") || "1236";
  const ADMIN_USERNAME = "admin";

  const showSaving = () => window.appwriteMirror && window.appwriteMirror.showSaving && window.appwriteMirror.showSaving("Signing in");
  const hideSaving = () => window.appwriteMirror && window.appwriteMirror.hideSaving && window.appwriteMirror.hideSaving();
  const waitForSync = async () => {
    if (window.appwriteMirrorReady) {
      await window.appwriteMirrorReady;
    }
    if (window.appwriteMirror && typeof window.appwriteMirror.waitForWrites === "function") {
      await window.appwriteMirror.waitForWrites();
    }
  };

  if (entereduser === ADMIN_USERNAME && enteredpass === adminPassword) {
      localStorage.setItem("isAdmin", "true");
      showSaving();
      await waitForSync();
      hideSaving();
      window.location.href = "admin.html";
      return;
  }

  if (allUsers.length === 0){
    message.style.display = "flex";
    errorText.style.display = "flex";
    errorText.innerText = "Not Yet Registered Yet";
    return;
  }

  const foundUser = allUsers.find(u => 
    u.username === entereduser && u.password === enteredpass
  );

  if (foundUser) {
    const userIndex = allUsers.findIndex(u => u.username === foundUser.username);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    const now = new Date().toLocaleString('en-GB', options);

    allUsers[userIndex].lastLogin = foundUser.currentLogin || "First time access";
    allUsers[userIndex].currentLogin = now;

    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    window.setCurrentUser ? window.setCurrentUser(allUsers[userIndex]) : sessionStorage.setItem("currentUser", JSON.stringify(allUsers[userIndex]));

    showSaving();
    await waitForSync();
    hideSaving();

    if (allUsers[userIndex].passwordChanged) {
        window.location.href = "course.html";
    } else {
        window.location.href = "change-password.html";
      }
  } else {
    message.style.display = "flex";
    errorText.style.display = "flex";
    errorText.innerText = "Invalid login, please try again";
  }
});
