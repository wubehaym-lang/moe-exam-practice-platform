document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const currentSubject = sessionStorage.getItem('currentSubject');

    if (!user || !currentSubject) {
        window.location.href = 'index.html';
        return;
    }

    const streamSubjects = {
        "Natural Science": ["English", "Mathematics", "Physics", "Biology", "Scholastic aptitude test", "Chemistry"],
        "Social Science": ["English", "Mathematics", "Geography", "History", "Scholastic aptitude test", "Economics"]
    };

    const availableSubjects = streamSubjects[user.stream] || [];
    if (!availableSubjects.includes(currentSubject)) {
        window.location.href = 'course.html';
        return;
    }

    const examCode = (user.stream === "Natural Science" ? "ns" : "ss") + "102018";

    const contentEl = document.getElementById('course-content');
    const attemptEl = document.getElementById('course-attempt');
    const finishedEl = document.getElementById('finshedatt');
    const popup = document.getElementById('popup');
    const examPassInput = document.getElementById('exampass');
    const errorMsg = document.getElementById('errorMsg');
    const examTypeList = document.getElementById('exam-type-list');

    const getTypes = () => {
        if (typeof getExamTypesForSubject === 'function') {
            const types = getExamTypesForSubject(user.stream, currentSubject);
            return types.length ? types : [];
        }
        return ["Mock Exam"];
    };

    const availableTypes = getTypes();
    const currentExamType = sessionStorage.getItem('currentExamType') || availableTypes[0] || "Mock Exam";
    sessionStorage.setItem('currentExamType', currentExamType);

    const finishKey = (examType) => `examFinished_${user.username}_${currentSubject}_${examType}`;
    const timerKey = (examType) => `examEndTime_${user.username}_${currentSubject}_${examType}`;

    function hideAll() {
        contentEl.style.display = 'none';
        attemptEl.style.display = 'none';
        finishedEl.style.display = 'none';
    }

    function showContent() {
        hideAll();
        contentEl.style.display = 'block';
        document.getElementById('pageTitle').innerText = `${examCode}: ${currentSubject}`;
    }

    function updateBreadcrumbs(examType) {
        document.getElementById('subjectExam').innerText = currentSubject;
        document.getElementById('bc-subject-link').onclick = (e) => {
            e.preventDefault();
            showContent();
        };
        document.getElementById('bc-examtype').innerText = examType;
        document.getElementById('attemptTitle').innerText = `${currentSubject} — ${examType}`;
    }

    function showAttempt(examType) {
        hideAll();
        sessionStorage.setItem('currentExamType', examType);
        updateBreadcrumbs(examType);

        const settings = JSON.parse(localStorage.getItem("globalExamSettings")) || {};
        const subjectData = settings[user.stream] && settings[user.stream][currentSubject];
        const mins = subjectData ? Number(subjectData.duration) || 60 : 60;

        document.getElementById('timeLimitDisplay').innerText = `Time limit: ${mins} minute${mins !== 1 ? 's' : ''}`;
        document.getElementById('popupTimeText').innerText =
            `Your attempt will have a time limit of ${mins} minute${mins !== 1 ? 's' : ''}. When you start, the timer will begin to count down and cannot be paused. You must finish before it expires.`;

        const openBtn = document.getElementById('openBtn');
        const passwordNote = document.getElementById('passwordNote');
        const inProgress = !!localStorage.getItem(timerKey(examType));

        if (inProgress) {
            openBtn.textContent = 'Continue Attempt';
            openBtn.onclick = () => { window.location.href = 'exam.html'; };
            if (passwordNote) passwordNote.style.display = 'none';
        } else {
            openBtn.textContent = 'Attempt Exam';
            openBtn.onclick = () => {
                popup.style.display = 'flex';
                examPassInput.value = '';
                errorMsg.style.display = 'none';
                examPassInput.focus();
            };
            if (passwordNote) passwordNote.style.display = '';
        }

        attemptEl.style.display = 'block';
        document.getElementById('pageTitle').innerText = `${examCode}: ${currentSubject} — ${examType}`;
    }

    function showFinished(examType) {
        hideAll();
        const savedTime = localStorage.getItem(`finishTime_${user.username}_${currentSubject}_${examType}`) || "Submitted";
        document.getElementById('finSubjectTitle').innerText = currentSubject;
        document.getElementById('bc-fin-subject').innerText = `${currentSubject} — ${examType}`;
        document.getElementById('datetime').innerText = savedTime;
        finishedEl.style.display = 'block';
        document.getElementById('pageTitle').innerText = `${examCode}: ${currentSubject}`;
    }

    document.getElementById('subjectTitle').innerText = currentSubject;
    document.getElementById('streamTitle').innerText = user.stream;
    examTypeList.innerHTML = '';

    if (availableTypes.length === 0) {
        examTypeList.innerHTML = '<p style="padding:12px; color:#666;">No exam types available for this subject.</p>';
    } else {
        availableTypes.forEach(examType => {
            const row = document.createElement('div');
            row.className = 'exam';
            row.innerHTML = `
                <div class="top-row">
                    <div class="box icon-box">
                        <img src="icon/examm.png" alt="exam icon">
                    </div>
                    <div class="box text-box">
                        <h4 class="move">${currentSubject} ${examType}</h4>
                    </div>
                </div>
            `;

            row.querySelector('.move').addEventListener('click', () => {
                sessionStorage.setItem('currentExamType', examType);
                if (localStorage.getItem(finishKey(examType)) === 'true') {
                    showFinished(examType);
                } else {
                    showAttempt(examType);
                }
            });

            examTypeList.appendChild(row);
        });
    }

    const accordionToggle = document.getElementById('accordionToggle');
    const collapseLink = document.getElementById('collapseLink');
    let isCollapsed = false;

    function toggleAccordion() {
        isCollapsed = !isCollapsed;
        examTypeList.style.display = isCollapsed ? 'none' : 'flex';
        collapseLink.textContent = isCollapsed ? 'Expand all' : 'Collapse all';
        accordionToggle.style.transform = isCollapsed ? 'rotate(-90deg)' : '';
    }

    if (accordionToggle) accordionToggle.addEventListener('click', toggleAccordion);
    if (collapseLink) collapseLink.addEventListener('click', (e) => { e.preventDefault(); toggleAccordion(); });

    document.getElementById('backFromFinished').addEventListener('click', showContent);

    const hidepop = () => {
        popup.style.display = 'none';
        examPassInput.value = '';
        errorMsg.style.display = 'none';
    };

    document.getElementById('closBtn').addEventListener('click', hidepop);
    document.getElementById('closBtnb').addEventListener('click', hidepop);
    popup.addEventListener('click', (e) => { if (e.target === popup) hidepop(); });

    document.getElementById('stratm').addEventListener('click', () => {
        const enteredPassword = examPassInput.value.trim();
        const globalSettings = JSON.parse(localStorage.getItem("globalExamSettings")) || {};
        const subjectData = globalSettings[user.stream] && globalSettings[user.stream][currentSubject];

        if (!subjectData || subjectData.verified === false) {
            errorMsg.style.color = "orange";
            errorMsg.innerText = "Exam is waiting for admin verification. Please wait.";
            errorMsg.style.display = "block";
            return;
        }

        if (!enteredPassword) {
            errorMsg.style.color = "red";
            errorMsg.innerText = "Please enter the exam password.";
            errorMsg.style.display = "block";
            return;
        }

        if (enteredPassword === subjectData.password) {
            hidepop();
            sessionStorage.setItem('currentExamType', currentExamType);
            window.location.href = "exam.html";
        } else {
            errorMsg.style.color = "red";
            errorMsg.innerText = "Incorrect password. Please try again.";
            errorMsg.style.display = "block";
            examPassInput.value = '';
            examPassInput.focus();
        }
    });

    examPassInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('stratm').click();
    });

    const initialType = availableTypes.includes(currentExamType) ? currentExamType : availableTypes[0];
    if (initialType && localStorage.getItem(finishKey(initialType)) === 'true') {
        showFinished(initialType);
    } else {
        showContent();
    }
});
