    // ── Populate user info ─────────────────────────────────────────────────
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        document.getElementById("codeDisplay").innerText = user.username;
        document.getElementById("nameTitle").innerText   = getDisplayName(user.fullName).toUpperCase();
        updateAvatars(user.fullName);
    }

    // ── Alert close button ─────────────────────────────────────────────────
    document.getElementById("alertCloseBtn").addEventListener("click", () => {
        document.getElementById("alertBanner").style.display = "none";
    });

    // ── Helpers ────────────────────────────────────────────────────────────
    function setError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const wrap  = document.getElementById("wrap-" + fieldId);
        const err   = document.getElementById("err-" + fieldId);
        input.classList.add("input-error");
        wrap.classList.add("wrap-error");
        err.textContent  = message;
        err.style.display = "block";
    }

    function clearError(fieldId) {
        const input = document.getElementById(fieldId);
        const wrap  = document.getElementById("wrap-" + fieldId);
        const err   = document.getElementById("err-" + fieldId);
        input.classList.remove("input-error");
        wrap.classList.remove("wrap-error");
        err.textContent  = "";
        err.style.display = "none";
    }

    function clearAllErrors() {
        ["currentPass", "newPass", "confirmPass"].forEach(id => clearError(id));
    }

    // ── Clear error as soon as the user starts typing in that field ────────
    ["currentPass", "newPass", "confirmPass"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => clearError(id));
    });

    // ── Save changes ───────────────────────────────────────────────────────
    document.getElementById("saveBtn").addEventListener("click", function () {
        const currentUser    = JSON.parse(localStorage.getItem("currentUser"));
        const allUsers       = JSON.parse(localStorage.getItem("allUsers"));

        const currentPassVal = document.getElementById("currentPass").value;
        const newPassVal     = document.getElementById("newPass").value;
        const confirmPassVal = document.getElementById("confirmPass").value;

        clearAllErrors();

        let hasError = false;

        // ── 1. Required checks (show all empty fields at once) ─────────────
        if (!currentPassVal) { setError("currentPass", "Required"); hasError = true; }
        if (!newPassVal)      { setError("newPass",     "Required"); hasError = true; }
        if (!confirmPassVal)  { setError("confirmPass", "Required"); hasError = true; }

        if (hasError) return;

        // ── 2. Current password correct? ───────────────────────────────────
        // Always look up from allUsers so we get the freshest password
        // (avoids stale currentUser from Appwrite sync across devices)
        const freshUser = allUsers
            ? allUsers.find(u => u.username === currentUser.username)
            : null;
        const actualPassword = (freshUser && freshUser.password) || currentUser.password;
        if (currentPassVal !== actualPassword) {
            setError("currentPass", "Invalid login, please try again");
            return;
        }

        // ── 3. New password length ─────────────────────────────────────────
        if (newPassVal.length < 5) {
            setError("newPass", "Password must be at least 5 characters");
            return;
        }

        // ── 4. Passwords match? ────────────────────────────────────────────
        if (newPassVal !== confirmPassVal) {
            setError("newPass",     "These passwords do not match");
            setError("confirmPass", "These passwords do not match");
            return;
        }

        // ── SUCCESS ────────────────────────────────────────────────────────
        const userIndex = allUsers.findIndex(u => u.username === currentUser.username);
        if (userIndex === -1) return;

        if (!allUsers[userIndex].originalPassword) {
            // Migrate old typo key (orginalPassword) if present, otherwise snapshot current
            allUsers[userIndex].originalPassword =
                allUsers[userIndex].orginalPassword || currentUser.password;
        }
        delete allUsers[userIndex].orginalPassword; // clean up old typo key
        allUsers[userIndex].password        = newPassVal;
        allUsers[userIndex].passwordChanged = true;
        localStorage.setItem("allUsers", JSON.stringify(allUsers));

        currentUser.originalPassword =
            currentUser.originalPassword || currentUser.orginalPassword || currentUser.password;
        delete currentUser.orginalPassword; // clean up old typo key
        currentUser.password        = newPassVal;
        currentUser.passwordChanged = true;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        document.getElementById("chgPassbx").style.display      = "none";
        document.querySelector(".success-container").style.display = "flex";
    });

    // ── Continue button ────────────────────────────────────────────────────
    document.getElementById("continueToHome").addEventListener("click", function () {
        window.location.href = "course.html";
    });

    // ── Eye icon toggle ────────────────────────────────────────────────────
    document.querySelectorAll(".iconeye").forEach(eye => {
        eye.addEventListener("mousedown", e => e.preventDefault());
        eye.addEventListener("click", function () {
            const input = this.closest(".input-wrap").querySelector("input");
            const img   = this.querySelector("img");
            if (input.type === "password") {
                input.type = "text";
                img.src    = "icon/dis.png";
            } else {
                input.type = "password";
                img.src    = "icon/ena.png";
            }
            input.focus();
        });
    });