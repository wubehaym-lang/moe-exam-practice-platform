let currentStream = "Natural Science";
    let selectedUsers = [];
    let actionType = "";
    let userToDelete = null;
    let currentSort = "name";       // active sort key
    let sortDirection = "asc";      // "asc" | "desc"

    // ── How long (ms) since last heartbeat counts as "live" ──────
    const LIVE_THRESHOLD_MS = 3 * 60 * 1000;  // 3 minutes

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

    // ── Live detection ────────────────────────────────────────────
    // Returns true if the student wrote a heartbeat within the last 3 minutes.
    function isStudentLive(username) {
        const ts = localStorage.getItem(`userLogintime_${username}`);
        if (!ts) return false;
        return (Date.now() - parseInt(ts, 10)) < LIVE_THRESHOLD_MS;
    }

    // Count live students in current stream
    function countLiveStudents(users) {
        return users.filter(u => isStudentLive(u.username)).length;
    }

    // ── Sort helpers ──────────────────────────────────────────────
    function sortUsers(users) {
        const sorted = [...users];
        sorted.sort((a, b) => {
            let valA, valB;
            switch (currentSort) {
                case "name":
                    valA = getDisplayName(a.fullName).toLowerCase();
                    valB = getDisplayName(b.fullName).toLowerCase();
                    break;
                case "id":
                    valA = String(a.username || "");
                    valB = String(b.username || "");
                    break;
                case "passwordChanged":
                    // Changed (true) first in asc, Not-changed first in desc
                    valA = a.passwordChanged ? 1 : 0;
                    valB = b.passwordChanged ? 1 : 0;
                    break;
                case "live":
                    // Live (true) first in asc
                    valA = isStudentLive(a.username) ? 1 : 0;
                    valB = isStudentLive(b.username) ? 1 : 0;
                    break;
                default:
                    return 0;
            }
            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
        return sorted;
    }

    function setActiveSort(value) {
        const [key, dir] = String(value || "name-asc").split("-");
        currentSort = key || "name";
        sortDirection = dir || ((key === "live" || key === "passwordChanged") ? "desc" : "asc");
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
        const rawUsers = getFilteredUsers();
        const users = sortUsers(rawUsers);

        // Update live badge on the sort button
        const liveCount = countLiveStudents(rawUsers);
        const badge = document.getElementById("liveCountBadge");
        if (badge) {
            badge.textContent = liveCount;
            badge.style.display = liveCount > 0 ? "inline-flex" : "none";
        }

        title.innerText = currentStream;
        body.innerHTML = "";
        document.getElementById("selectAll").checked = false;

        if (users.length === 0) {
            body.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 16px;">No students found.</td></tr>`;
            return;
        }

        users.forEach(user => {
            const progress = getSubjectProgress(user.username, user.stream);
            const progressText = `${progress.completedCount}/${progress.totalCount} subjects`;
            const live = isStudentLive(user.username);
            const liveHtml = live
                ? `<span class="live-indicator live-on" title="Currently online">&#9679; Live</span>`
                : `<span class="live-indicator live-off" title="Offline">&#9679; Offline</span>`;

            const row = `
                <tr class="${live ? "row-live" : ""}">
                    <td><input type="checkbox" class="selectUser" value="${user.username}"></td>
                    <td>${user.username}</td>
                    <td>${getDisplayName(user.fullName)}</td>
                    <td>${user.passwordChanged ? "Yes" : "No"}</td>
                    <td>${progressText}</td>
                    <td>${user.password}</td>
                    <td>${liveHtml}</td>
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
        const live = isStudentLive(username);
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
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                <strong>Status:</strong>
                ${live
                    ? `<span class="live-indicator live-on">&#9679; Currently online</span>`
                    : `<span class="live-indicator live-off">&#9679; Offline</span>`}
            </div>
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

    function setConfirmLoading(isLoading) {
        const btn = document.getElementById("universalConfirmBtn");
        if (!btn) return;
        btn.disabled   = isLoading;
        btn.textContent = isLoading ? "Saving…" : "Confirm";
    }

    async function waitForSyncReady() {
        if (window.appwriteMirrorReady) {
            await window.appwriteMirrorReady;
        }
    }

    async function handleConfirm() {
        if (selectedUsers.length === 0) return;

        setConfirmLoading(true);

        try {
            await waitForSyncReady();

            let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

            if (actionType === "delete") {
                allUsers = allUsers.filter(u => !selectedUsers.includes(u.username));
                selectedUsers.forEach(id => {
                    clearUserData(id);
                    const currentUser = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(sessionStorage.getItem("currentUser") || "null");
                    if (currentUser && currentUser.username === id) {
                        window.clearCurrentUser ? window.clearCurrentUser() : sessionStorage.removeItem("currentUser");
                    }
                });

            } else if (actionType === "resetPass") {
                selectedUsers.forEach(username => {
                    const user = allUsers.find(u => u.username === username);
                    if (user) {
                        user.password        = user.originalPassword || user.orginalPassword || user.password;
                        user.passwordChanged = false;
                        const currentUser = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(sessionStorage.getItem("currentUser") || "null");
                        if (currentUser && currentUser.username === username) {
                            window.setCurrentUser ? window.setCurrentUser(user) : sessionStorage.setItem("currentUser", JSON.stringify(user));
                        }
                    }
                });

            } else if (actionType === "reset") {
                selectedUsers.forEach(username => {
                    clearUserData(username);
                });
            }

            localStorage.setItem("allUsers", JSON.stringify(allUsers));
            if (window.appwriteMirror && typeof window.appwriteMirror.waitForWrites === "function") {
                await window.appwriteMirror.waitForWrites();
            }

        } catch (err) {
            console.error("Admin action failed:", err);
            alert("An error occurred while saving. Please try again.");
        } finally {
            setConfirmLoading(false);
        }

        loadAdminTable();
        closeUniversalModal();
    }

    document.addEventListener("DOMContentLoaded", async () => {

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

        // ── Sort dropdown ────────────────────────────────────────
        const sortSelect = document.getElementById("sortSelect");
        if (sortSelect) {
            sortSelect.addEventListener("change", () => {
                setActiveSort(sortSelect.value);
                loadAdminTable();
            });
            setActiveSort(sortSelect.value || "name-asc");
        }

        await waitForSyncReady();
        loadAdminTable();

        // ── Auto-refresh live status every 30 seconds ─────────────
        setInterval(() => {
            if (window.appwriteMirror && typeof window.appwriteMirror.refresh === "function") {
                window.appwriteMirror.refresh().then(loadAdminTable);
            } else {
                loadAdminTable();
            }
        }, 30000);
    });
