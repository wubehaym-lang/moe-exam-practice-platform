let currentStream = "Natural Science";
    let selectedUsers = [];
    let actionType = "";
    let userToDelete = null;

    const streamSubjects = {
        "Natural Science": ["English", "Mathematics", "Physics", "Biology", "Scholastic aptitude test", "Chemistry"],
        "Social Science": ["English", "Mathematics", "Geography", "History", "Scholastic aptitude test", "Economics"]
    };

    function splitUserName(fullName) {
        return String(fullName || "").trim().split(/\s+/).filter(Boolean);
    }

    function getDisplayName(fullName) {
        const parts = splitUserName(fullName);
        if (parts.length >= 2) return `${parts[0]} ${parts[1]}`;
        return parts[0] || "";
    }

    function getSubjectTypes() {
        return ["Mock Exam"];
    }

    function getSubjectCompleted(username, subject) {
        return getSubjectTypes().some(type =>
            localStorage.getItem(`examFinished_${username}_${subject}_${type}`) === "true"
        );
    }

    function getSubjectProgress(username, stream) {
        const subjects = streamSubjects[stream] || [];
        const completed = subjects.filter(subject => getSubjectCompleted(username, subject));
        return {
            completedCount: completed.length,
            totalCount: subjects.length,
            subjects
        };
    }

    function getFilteredUsers() {
        const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
        const searchValue = document.getElementById("find").value.trim().toLowerCase();

        return allUsers.filter(user => {
            const matchesStream = user.stream === currentStream;
            const displayName = getDisplayName(user.fullName);
            const matchesSearch =
                searchValue === "" ||
                (user.username && user.username.toLowerCase().includes(searchValue)) ||
                (user.fullName && user.fullName.toLowerCase().includes(searchValue)) ||
                (displayName && displayName.toLowerCase().includes(searchValue));

            return matchesStream && matchesSearch;
        });
    }

    function loadAdminTable() {
        const body = document.getElementById("studentTableBody");
        const title = document.getElementById("streamTitle");
        const users = getFilteredUsers();

        title.innerText = currentStream;
        body.innerHTML = "";
        document.getElementById("selectAll").checked = false;

        if (users.length === 0) {
            body.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 16px;">No students found.</td></tr>`;
            return;
        }

        users.forEach(user => {
            const progress = getSubjectProgress(user.username, user.stream);
            const progressText = `${progress.completedCount}/${progress.totalCount} subjects`;

            const row = `
                <tr>
                    <td><input type="checkbox" class="selectUser" value="${user.username}"></td>
                    <td>${user.username}</td>
                    <td>${getDisplayName(user.fullName)}</td>
                    <td>${user.passwordChanged ? "Yes" : "No"}</td>
                    <td>${progressText}</td>
                    <td>${user.password}</td>
                    <td>
                        <button class="rest" onclick="resetStudent('${user.username}')">Reset Pass</button>
                        <button class="btn-reset" onclick="deleteStudent('${user.username}')">Delete</button>
                        <button class="rest" onclick="openProfile('${user.username}')">Profile</button>
                    </td>
                </tr>
            `;
            body.innerHTML += row;
        });
    }

    function toggleStream() {
        currentStream = currentStream === "Natural Science" ? "Social Science" : "Natural Science";
        loadAdminTable();
    }

    function getSelectedUsers() {
        const checked = document.querySelectorAll(".selectUser:checked");
        return Array.from(checked).map(cb => cb.value);
    }

    function openUniversalModal(type, message, icon = "♻️") {
        actionType = type;
        document.getElementById("universalMessage").innerText = message;
        document.getElementById("modalIcon").innerText = icon;
        document.getElementById("universalModal").style.display = "flex";
    }

    function closeUniversalModal() {
        document.getElementById("universalModal").style.display = "none";
        selectedUsers = [];
        actionType = "";
    }

    function openProfile(username) {
        const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
        const user = allUsers.find(u => u.username === username);
        if (!user) return;

        const progress = getSubjectProgress(username, user.stream);
        const subjectRows = progress.subjects.map(subject => {
            const done = getSubjectCompleted(username, subject);
            const finishTime = localStorage.getItem(`finishTime_${username}_${subject}_Mock Exam`) || "—";
            return `<tr>
                <td>${subject}</td>
                <td>${done ? "Completed" : "Pending"}</td>
                <td>${finishTime}</td>
            </tr>`;
        }).join("");

        const profileHtml = `
            <div><strong>Full name:</strong> ${getDisplayName(user.fullName)}</div>
            <div><strong>Username:</strong> ${user.username || ""}</div>
            <div><strong>Stream:</strong> ${user.stream || ""}</div>
            <div><strong>Center:</strong> ${user.center || ""}</div>
            <div><strong>Enrollment:</strong> ${user.type || ""}</div>
            <div><strong>Password changed:</strong> ${user.passwordChanged ? "Yes" : "No"}</div>
            <div><strong>Last login:</strong> ${user.lastLogin || "—"}</div>
            <div><strong>Current login:</strong> ${user.currentLogin || "—"}</div>
            <div style="margin-top:14px;"><strong>Progress:</strong> ${progress.completedCount}/${progress.totalCount} subjects completed</div>
            <table style="width:100%; margin-top:12px; border-collapse:collapse;">
                <thead>
                    <tr>
                        <th style="text-align:left; border-bottom:1px solid #ddd; padding:6px;">Subject</th>
                        <th style="text-align:left; border-bottom:1px solid #ddd; padding:6px;">Status</th>
                        <th style="text-align:left; border-bottom:1px solid #ddd; padding:6px;">Submitted</th>
                    </tr>
                </thead>
                <tbody>${subjectRows}</tbody>
            </table>
        `;

        document.getElementById("profileTitle").innerText = `${getDisplayName(user.fullName)} profile`;
        document.getElementById("profileBody").innerHTML = profileHtml;
        document.getElementById("profileModal").style.display = "flex";
    }

    function closeProfileModal() {
        document.getElementById("profileModal").style.display = "none";
    }

    function deleteStudent(username) {
        selectedUsers = [username];
        openUniversalModal("delete", `Are you sure? This will permanently remove ${username}.`, "🗑️");
    }

    function resetStudent(username) {
        selectedUsers = [username];
        openUniversalModal("resetPass", `Reset password for ${username} to original?`, "🔑");
    }

    function clearUserData(username) {
        const allSubjects = Object.values(streamSubjects).flat();
        const types = getSubjectTypes();

        allSubjects.forEach(subject => {
            types.forEach(type => {
                localStorage.removeItem(`examFinished_${username}_${subject}_${type}`);
                localStorage.removeItem(`finishTime_${username}_${subject}_${type}`);
                localStorage.removeItem(`examEndTime_${username}_${subject}_${type}`);
            });
        });
        localStorage.removeItem(`examUnlocked_${username}`);
        localStorage.removeItem(`userLogintime_${username}`);
    }

    // ── Helper: show/hide a loading state on the Confirm button ──
    function setConfirmLoading(isLoading) {
        const btn = document.getElementById("universalConfirmBtn");
        if (!btn) return;
        btn.disabled   = isLoading;
        btn.textContent = isLoading ? "Saving…" : "Confirm";
    }

    // ── Helper: wait for Appwrite sync to be fully ready ─────────
    // This prevents the race condition where admin acts before
    // appwrite-sync.js has finished its boot() sequence.
    async function waitForSyncReady() {
        if (window.appwriteMirrorReady) {
            await window.appwriteMirrorReady;   // the boot() promise
        }
    }

    // ── Helper: force-push all current localStorage values to Appwrite ──
    // Called after every admin action so changes are guaranteed to
    // reach the database even if a write somehow slipped through
    // before the auto-patch was active.
    async function forceSyncToAppwrite() {
        if (window.appwriteMirror && typeof window.appwriteMirror.flush === "function") {
            await window.appwriteMirror.flush();
        }
    }

    // ============================================================
    // MAIN CONFIRM HANDLER — async so we can await Appwrite ready
    // ============================================================
    async function handleConfirm() {
        if (selectedUsers.length === 0) return;

        setConfirmLoading(true);

        try {
            // ── STEP 1: Make sure Appwrite sync is ready ─────────────
            // This blocks until boot() finishes hydrating, so all
            // localStorage writes below are guaranteed to auto-sync.
            await waitForSyncReady();

            let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

            // ── STEP 2: Apply the action ──────────────────────────────

            if (actionType === "delete") {
                // Remove from allUsers array
                allUsers = allUsers.filter(u => !selectedUsers.includes(u.username));

                // Remove all individual exam keys + currentUser if matched
                selectedUsers.forEach(id => {
                    clearUserData(id);          // removeItem calls auto-delete from Appwrite
                    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                    if (currentUser && currentUser.username === id) {
                        localStorage.removeItem("currentUser");   // auto-synced to Appwrite
                    }
                });

            } else if (actionType === "resetPass") {
                // ── Reset Password ONLY — does NOT touch exam progress ──
                selectedUsers.forEach(username => {
                    const user = allUsers.find(u => u.username === username);
                    if (user) {
                        user.password        = user.originalPassword || user.password;
                        user.passwordChanged = false;

                        // If this student happens to be the currently-cached
                        // user in localStorage, update that record too
                        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                        if (currentUser && currentUser.username === username) {
                            localStorage.setItem("currentUser", JSON.stringify(user)); // auto-synced
                        }
                    }
                    // clearUserData() intentionally NOT called — password reset only
                });

            } else if (actionType === "reset") {
                // ── Reset Exam Progress ONLY — does NOT touch password ──
                selectedUsers.forEach(username => {
                    clearUserData(username);    // removeItem calls auto-delete from Appwrite
                    // password / passwordChanged intentionally NOT touched
                });
            }

            // ── STEP 3: Save updated allUsers to localStorage ─────────
            // The auto-patch mirrors this setItem to Appwrite immediately
            localStorage.setItem("allUsers", JSON.stringify(allUsers));

            // ── STEP 4: Force-flush all current keys to Appwrite ──────
            // Safety net: re-pushes everything in localStorage so nothing
            // is missed even if the auto-patch somehow lagged
            await forceSyncToAppwrite();

        } catch (err) {
            console.error("Admin action failed:", err);
            alert("An error occurred while saving. Please try again.");
        } finally {
            setConfirmLoading(false);
        }

        loadAdminTable();
        closeUniversalModal();
    }

    // ============================================================
    // DOMContentLoaded — wire up all buttons here so elements exist
    // ============================================================
    document.addEventListener("DOMContentLoaded", async () => {

        // ── Wire action buttons ───────────────────────────────────
        document.getElementById("universalConfirmBtn").onclick = handleConfirm;

        document.getElementById("bulkDeleteBtn").onclick = () => {
            const selected = getSelectedUsers();
            if (selected.length === 0) return alert("Select students first.");
            selectedUsers = selected;
            openUniversalModal("delete", `Delete ${selected.length} selected students?`, "🗑️");
        };

        document.getElementById("bulkResetBtn").onclick = () => {
            const selected = getSelectedUsers();
            if (selected.length === 0) return alert("Select students first.");
            selectedUsers = selected;
            openUniversalModal("reset", `Reset exam status for ${selected.length} students?`, "♻️");
        };

        document.getElementById("switchStreamBtn").addEventListener("click", toggleStream);

        document.getElementById("find").addEventListener("input", loadAdminTable);

        document.getElementById("selectAll").addEventListener("change", function () {
            const checkboxes = document.querySelectorAll(".selectUser");
            checkboxes.forEach(cb => cb.checked = this.checked);
        });

        // ── Wait for Appwrite to hydrate BEFORE loading the table ─
        // Without this, the table loads from stale localStorage data
        // instead of the latest Appwrite values.
        await waitForSyncReady();
        loadAdminTable();
    });
