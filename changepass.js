document.getElementById("saveBtn").addEventListener("click", function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const allUsers = JSON.parse(localStorage.getItem("allUsers"));
    
    const currentPassInput = document.getElementById("currentPass").value;
    const newPassInput = document.getElementById("newPass").value;
    const confirmPassInput = document.getElementById("confirmPass").value;
    const chage = document.getElementById("chage");
    
    // 1. Check if Current Password is correct
    if (currentPassInput !== currentUser.password) {
        chage.style.color = "red";
        chage.innerText = "Current password is incorrect.";
        
        return;
    }

    // 2. Check if New Password is at least 8 characters
    if (newPassInput.length < 8) {
        chage.style.color = "orange"
        chage.innerText = "New password must be at least 8 characters long.";
        
        return;
    }

    // 3. Check if New Passwords match
    if (newPassInput !== confirmPassInput) {
        chage.style.color = "red"
        chage.innerText = "New passwords do not match.";
        
        return;
    }
    // --- SUCCESS LOGIC ---
    const userIndex = allUsers.findIndex(u => u.username === currentUser.username);
    allUsers[userIndex].password = newPassInput;
    allUsers[userIndex].passwordChanged = true; // FLAG AS CHANGED
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    currentUser.password = newPassInput;
    currentUser.passwordChanged = true; // FLAG AS CHANGED
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Hide the form and show success message
    document.getElementById("chgPassbx").style.display = "none";
    document.querySelector(".success-container").style.display = "flex";
});

// THE CONTINUE BUTTON LOGIC
document.getElementById("continueToHome").addEventListener("click", function() {
    // Everyone goes to the unified dashboard
    window.location.href = "course.html";
});

// Set the username in the form display
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(user) {
      // 3. Update the text fields
      document.getElementById("codeDisplay").innerText = user.username;
      document.getElementById("nameTitle").innerText = user.fullName.toUpperCase();
      // 4. Update the avatar initials (New Logic)
      updateAvatars(user.fullName);
  };