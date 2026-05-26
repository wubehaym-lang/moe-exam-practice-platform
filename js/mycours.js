const user = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(sessionStorage.getItem("currentUser") || "null");

    // ── Security ──────────────────────────────────────────────────────────
    if (!user) {
        window.location.href = 'index.html';
    } else if (user.passwordChanged === false) {
        window.location.href = 'change-password.html';
    } else {

    // ── Stream subjects — single source of truth ──────────────────────────
    const streamSubjects = {
        "Natural Science": ["English", "Mathematics", "Physics", "Biology", "Scholastic aptitude test", "Chemistry"],
        "Social Science":  ["English", "Mathematics", "Geography", "History", "Scholastic aptitude test", "Economics"]
    };

    const subjects = streamSubjects[user.stream] || [];

    // ── Welcome name ──────────────────────────────────────────────────────
    document.getElementById("firstName").innerText = user.fullName.split(" ")[0];
    if (typeof updateAvatars === "function") updateAvatars(user.fullName);
    document.title = user.stream + " — Exam Overview";

    // ── Build one card per subject ────────────────────────────────────────
    const grid = document.getElementById("courseGrid");

    function buildCards(list) {
        grid.innerHTML = "";
        list.forEach(subject => {
            const card = document.createElement("div");
            card.className = "course-card";
            card.style.cursor = "pointer";
            card.innerHTML = `
                <div class="card-header"></div>
                <div class="card-body">
                    <div class="topcrd">
                        <span class="course-name">${subject} - ${user.stream}</span>
                        <span class="course-stream">${user.stream}</span>
                    </div>
                    <button class="menu-dots" type="button">⋮</button>
                </div>
            `;

            // Clicking the image header OR the subject name → go to subject view
            const openSubject = () => {
                sessionStorage.setItem("currentSubject", subject);
                window.location.href = "view.html";
            };

            card.querySelector(".card-header").addEventListener("click", openSubject);
            card.querySelector(".course-name").addEventListener("click", openSubject);
            grid.appendChild(card);
        });
    }

    buildCards(subjects);

    // ── Live search filter ────────────────────────────────────────────────
    document.getElementById("searchInput").addEventListener("input", function () {
        const q = this.value.toLowerCase();
        buildCards(subjects.filter(s => s.toLowerCase().includes(q)));
    });

    } // end else