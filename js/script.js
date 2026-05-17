document.getElementById("loginBtn").addEventListener("click", function () {
  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  const errorText = document.getElementById("errorText");
  const entereduser = document.getElementById("username").value;
  const enteredpass = document.getElementById("password").value;


  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "1234";

  // 🔐 Admin login
  if (entereduser === ADMIN_USERNAME && enteredpass === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      window.location.href = "admin.html";
      return;
  }

  if (allUsers.length === 0){
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
      localStorage.setItem("currentUser", JSON.stringify(allUsers[userIndex]));

      if (allUsers[userIndex].passwordChanged) {
          window.location.href = "course.html";
      } else {
          window.location.href = "Change_Password.html";
      }

  } else {
      errorText.innerText = "Invalid username or password.";
  }
});
