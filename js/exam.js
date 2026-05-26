document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    // 1. DATA & SECURITY INITIALIZATION
    // =====================================================================
    const user = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(sessionStorage.getItem("currentUser") || "null");
    const currentSubject = sessionStorage.getItem("currentSubject");
    const currentExamType = sessionStorage.getItem("currentExamType") || "Mock Exam";

    if (!user || !currentSubject) {
        window.location.replace("index.html");
        return;
    }

    const finishKey = `examFinished_${user.username}_${currentSubject}_${currentExamType}`;
    const timerKey  = `examEndTime_${user.username}_${currentSubject}_${currentExamType}`;

    if (localStorage.getItem(finishKey) === 'true') {
        window.location.replace("View.html");
        return;
    }

    // =====================================================================
    // 2. LOAD EXAM DATA
    // =====================================================================
    const defaultExamData = (typeof getExamQuestionsForSubject === "function")
        ? getExamQuestionsForSubject(user.stream, currentSubject, currentExamType)
        : ((questionBank[user.stream] && questionBank[user.stream][currentSubject]) ? questionBank[user.stream][currentSubject] : []);

    let examData     = JSON.parse(sessionStorage.getItem('examData'));
    let savedSubject = sessionStorage.getItem('savedSubject');
    let savedExamType = sessionStorage.getItem('savedExamType');
    let currentIndex = parseInt(sessionStorage.getItem('currentIndex')) || 0;

    if (!examData || savedSubject !== currentSubject || savedExamType !== currentExamType) {
        examData = JSON.parse(JSON.stringify(defaultExamData));
        currentIndex = 0;
        sessionStorage.setItem('savedSubject', currentSubject);
        sessionStorage.setItem('savedExamType', currentExamType);
    }

    if (!Array.isArray(examData) || examData.length === 0) {
        sessionStorage.removeItem('examData');
        sessionStorage.removeItem('savedSubject');
        sessionStorage.removeItem('savedExamType');
        window.location.replace('View.html');
        return;
    }

    // Tracks which question the student was on BEFORE entering summary.
    // "Return to attempt" restores this exact position, regardless of which
    // question the student may have browsed to in the summary table.
    let preSummaryIndex = currentIndex;

    // =====================================================================
    // 3. POPULATE UI HEADERS
    // =====================================================================
  //  document.getElementById("Subject").innerText = currentSubject;
   // document.getElementById("main-subject-title").innerText = currentSubject;
//    document.title = `${user.stream} Exam - ${currentSubject}`;

    // =====================================================================
    // 4. STATE MANAGEMENT
    // =====================================================================
    function saveState() {
        sessionStorage.setItem('examData', JSON.stringify(examData));
        sessionStorage.setItem('currentIndex', currentIndex);
        sessionStorage.setItem('currentStream', user.stream);
    }

    // =====================================================================
    // 5. ELEMENT REFERENCES
    // =====================================================================
    const optionsContainer  = document.getElementById('options-container');
    const queNoDisplay      = document.getElementById('queNo');
    const gridContainer     = document.getElementById('question-grid');
    const modal             = document.getElementById('confirmation-modal');
    const cancelBtn         = document.getElementById('cancel-modal-btn');
    const closeX            = document.getElementById('close-x');
    const finalSubmitBtn    = document.getElementById('final-submit-btn');
    const summarySubmitBtn  = document.getElementById('summary-submit-btn');
    const finishAttemptBtn  = document.getElementById('finishAttemptBtn');
    const returnBtn         = document.getElementById('return-btn');
    const notYetEl          = document.getElementById('notYet');

    const breadcrumbSubject = document.getElementById('subjectExam');
    const breadcrumbType    = document.getElementById('bc-examtype');
    const breadcrumbBack    = document.getElementById('bc-subject-link');
    const attemptTitleEl    = document.getElementById('attemptTitle');

    if (breadcrumbSubject) breadcrumbSubject.innerText = currentSubject;
    if (breadcrumbType) breadcrumbType.innerText = currentExamType;
    if (attemptTitleEl) attemptTitleEl.innerText = `${currentSubject} — ${currentExamType}`;
    if (breadcrumbBack) breadcrumbBack.onclick = (e) => { e.preventDefault(); window.location.replace('View.html'); };

    // =====================================================================
    // 6. VIEW SWITCHING HELPERS
    // =====================================================================
    function showQuestionView() {
        document.getElementById('summary-view').style.display  = 'none';
        document.getElementById('question-view').style.display = 'flex';
    }
    function showSummaryView() {
        document.getElementById('question-view').style.display = 'none';
        document.getElementById('summary-view').style.display  = 'flex';
    }
    function isInSummary() {
        return window.location.hash === '#summary';
    }

    // =====================================================================
    // 7. ENTER SUMMARY — saves position so "Return to attempt" can restore it
    // =====================================================================
    function goToSummary() {
        // Shade current question if answered before leaving
        if (examData[currentIndex].answer !== null) examData[currentIndex].isShaded = true;
        saveState();
        preSummaryIndex = currentIndex;   // snapshot position
        window.location.hash = 'summary';
    }

    // =====================================================================
    // 8. NAVIGATION
    //    When called from summary, clears hash → hashchange → question view.
    //    isShaded is set here so shading only updates on navigation.
    // =====================================================================
    function navigateTo(newIndex) {
        // Update shaded state of the question we're leaving — only here, not on answer/clear
        const leavingQ = examData[currentIndex];
        leavingQ.isShaded = (leavingQ.answer !== null);

        currentIndex = newIndex;
        saveState();

        if (isInSummary()) {
            window.location.hash = '';   // → hashchange → handleViewChange → loadQuestion
        } else {
            loadQuestion(currentIndex);
        }
    }

    // =====================================================================
    // 9. LOAD QUESTION
    // =====================================================================
    function loadQuestion(index) {
        const q = examData[index];
        queNoDisplay.textContent = index + 1;
        document.getElementById('question-text').textContent = q.question;

        document.getElementById('prePage').style.visibility = (index === 0) ? 'hidden' : 'visible';

        const nextBtn = document.getElementById('nexPag');
        nextBtn.textContent = (index === examData.length - 1) ? "Finish attempt..." : "Next page";

        // "Answer saved" / "Not yet answered" reflects truth when question loads
        // (i.e. after navigation, not during answering on the same question)
        if (notYetEl) notYetEl.textContent = (q.answer !== null) ? "Answer saved" : "Not yet answered";

        const btnTxt  = document.getElementById('btnTxt');
const btnIcon = document.getElementById('btnIcon');

// Select the two individual path shapes inside your HTML SVG
const paths = btnIcon.querySelectorAll('path');

if (q.isFlagged) {
    btnTxt.textContent = "Remove flag";
    // Path 1 (Stick): stays black
    paths[0].setAttribute('fill', '#000'); 
    // Path 2 (Flag body): fills completely with black when flagged
    paths[1].setAttribute('fill', '#000'); 
} else {
    btnTxt.textContent = "Flag question";
    // Path 1 (Stick): stays black (was #fff in your template, which hides it against light backgrounds!)
    paths[0].setAttribute('fill', '#000'); 
    // Path 2 (Flag body): becomes white with a black outline when unflagged
    paths[1].setAttribute('fill', '#fff'); 
}

        // ---- Build answer options ----
        optionsContainer.innerHTML = '';
        const labels = ['A', 'B', 'C', 'C'];

        // "Clear my choice" link — shown only if an answer was recorded
        const clearBtn = document.createElement('p');
        clearBtn.textContent = 'Clear my choice';
        clearBtn.className   = 'clear-choice';
        clearBtn.style.display = (q.answer !== null) ? 'block' : 'none';

        clearBtn.onclick = () => {
            // Clear the answer in data
            q.answer = null;
            saveState();

            // Re-enable all radio buttons and uncheck them visually
            optionsContainer.querySelectorAll('input[type="radio"]').forEach(r => {
                r.checked  = false;
                r.disabled = false;
            });

            // Hide the clear button immediately
            clearBtn.style.display = 'none';

            // *** Deliberately do NOT update notYet text or sidebar shading here.
            // Both will update correctly on the next navigation (Next / Prev /
            // Finish attempt). This matches the same delayed-update rule as answering.
        };

        q.options.forEach((opt, i) => {
            const row = document.createElement('div');
            row.className = 'option-row';
            const isChecked = q.answer === i;

            // Unique radio group name per question so switching questions
            // never carries over a checked state from another question.
            row.innerHTML = `<input type="radio" name="q-opt-${index}" value="${i}" ${isChecked ? 'checked' : ''}> <span>${labels[i]}.</span> <span>${opt}</span>`;

            const radioInput = row.querySelector('input');

            // Clicking anywhere on the row selects that option
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => {
                radioInput.checked = true;
                q.answer = i;
                saveState();
                clearBtn.style.display = 'block';
            });

            radioInput.addEventListener('change', () => {
                q.answer = i;
                saveState();
                clearBtn.style.display = 'block';
            });
            optionsContainer.appendChild(row);
        });
 
        optionsContainer.appendChild(clearBtn);
        updateSidebar();
    }

    // =====================================================================
    // 10. SIDEBAR GRID
    // =====================================================================
    function updateSidebar() {
        gridContainer.innerHTML = '';

        examData.forEach((q, i) => {
            const btn = document.createElement('button');
            btn.className = 'bx';
            if (i === currentIndex) btn.classList.add('current');
            if (q.isFlagged)        btn.classList.add('flagged');
            if (q.isShaded)         btn.classList.add('answered');
            btn.innerHTML = `<p class="p2">${i + 1}</p>`;
            btn.onclick = () => { navigateTo(i); };
            gridContainer.appendChild(btn);
        });

        if (finishAttemptBtn) gridContainer.appendChild(finishAttemptBtn);
    }

    // =====================================================================
    // 11. SUMMARY TABLE
    // =====================================================================
    function buildSummaryTable() {
    const subjectEl = document.getElementById('summary-subject');
    if (subjectEl) subjectEl.innerText = currentSubject;

    const tbody = document.getElementById('summary-tbody');
    tbody.innerHTML = '';

    examData.forEach((q, index) => {
        const tr = document.createElement('tr');
        
        // Define an inline, self-contained red SVG flag for offline reliability
        const inlineRedFlagSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style="width: 14px; height: 14px; margin-left: 6px; vertical-align: middle;">
                <path fill="#000" d="M144 96C144 78.3 135.7 64 128 64C120.3 64 112 78.3 112 96L112 544C112 561.7 120.3 576 128 576C135.7 576 144 561.7 144 544L144 118.4L144 96z" />
                <path fill="#000" stroke="#000" stroke-width="10" stroke-linejoin="round" d="M144 416L212.7 397.2C254.6 384.6 299.8 388.5 338.9 408.1C381.6 429.5 431.4 432.1 476.1 415.3L513.2 401.4C525.7 396.7 534 384.8 534 371.4L534 123.7C534 100.7 509.8 85.7 489.2 96L477.4 101.9C432.5 124.4 379.6 124.4 334.6 101.9C298.2 83.7 256.3 80.1 217.4 91.8L144 112Z" />
            </svg>
        `;

        // Use the inline SVG if flagged, otherwise leave it empty
        const flagIcon = q.isFlagged ? inlineRedFlagSvg : '';
        const statusText = (q.answer !== null) ? 'Answer saved' : 'Not yet answered';
        
        tr.innerHTML = `
            <td class="jump" style="cursor:pointer; display: flex; align-items: center;">${index + 1}${flagIcon}</td>
            <td>${statusText}</td>
        `;
        tr.querySelector('.jump').onclick = () => { navigateTo(index); };
        tbody.appendChild(tr);
    });
}

    // =====================================================================
    // 12. HANDLE VIEW CHANGE (hash-based routing)
    // =====================================================================
    function handleViewChange() {
        if (isInSummary()) {
            showSummaryView();
            buildSummaryTable();
            updateSidebar();

            const endTimeStr = localStorage.getItem(timerKey);
            if (endTimeStr) {
                const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
                const dateTimeSpan = document.getElementById('dateTime');
                if (dateTimeSpan) dateTimeSpan.innerText = new Date(parseInt(endTimeStr)).toLocaleString('en-GB', opts);
            }
        } else {
            showQuestionView();
            loadQuestion(currentIndex);
        }
    }

    window.addEventListener('hashchange', handleViewChange);

    // =====================================================================
    // 13. MODAL — show / hide
    // =====================================================================
    const showModal = () => { modal.style.display = 'flex'; };
    const hideModal = () => { modal.style.display = 'none'; };

    if (cancelBtn)        cancelBtn.onclick       = hideModal;
    if (closeX)           closeX.onclick          = hideModal;
    if (summarySubmitBtn) summarySubmitBtn.onclick = showModal;
    window.onclick = (event) => { if (event.target === modal) hideModal(); };

    // =====================================================================
    // 14. FINISH EXAM
    // =====================================================================
    function finishExam() {
        const freshUser = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(sessionStorage.getItem("currentUser") || "null");
        const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        const finishTime = new Date().toLocaleString('en-GB', opts);

        if (freshUser) {
            localStorage.setItem(`examFinished_${freshUser.username}_${currentSubject}_${currentExamType}`, 'true');
            localStorage.setItem(`finishTime_${freshUser.username}_${currentSubject}_${currentExamType}`, finishTime);
            localStorage.removeItem(timerKey);
        }

        sessionStorage.removeItem('examData');
        sessionStorage.removeItem('savedSubject');
        sessionStorage.removeItem('savedExamType');
        sessionStorage.setItem('currentPage', currentSubject.toLowerCase());
        window.location.replace('view.html');
    }

    if (finalSubmitBtn) {
        finalSubmitBtn.onclick = () => {
            localStorage.setItem(finishKey, 'true');
            finishExam();
        };
    }

    // =====================================================================
    // 15. BUTTON HANDLERS
    // =====================================================================

    // Next page — on last question goes to summary; shading updates on navigate
    document.getElementById('nexPag').onclick = () => {
        if (currentIndex < examData.length - 1) {
            navigateTo(currentIndex + 1);
        } else {
            goToSummary();
        }
    };

    // Previous page
    document.getElementById('prePage').onclick = () => {
        if (currentIndex > 0) navigateTo(currentIndex - 1);
    };

    // Flag toggle
    document.getElementById('colorBtn').onclick = () => {
        examData[currentIndex].isFlagged = !examData[currentIndex].isFlagged;
        saveState();
        loadQuestion(currentIndex);
        updateSidebar();
    };

    // "Finish attempt..." sidebar link → go to summary
    if (finishAttemptBtn) {
        finishAttemptBtn.onclick = () => { goToSummary(); };
    }

    // "Return to attempt" — restores the exact question the student was on
    // before entering summary, even if they browsed questions in the summary table
    if (returnBtn) {
        returnBtn.onclick = () => {
            currentIndex = preSummaryIndex;  // restore pre-summary position
            window.location.hash = '';       // → hashchange → handleViewChange → loadQuestion
        };
    }

    // =====================================================================
    // 16. BACK BUTTONS
    // =====================================================================
    document.querySelectorAll('.exam-back').forEach((btn) => {
        btn.addEventListener('click', () => {
            sessionStorage.setItem('currentPage', currentSubject.toLowerCase());
            window.location.replace('View.html');
        });
    });

    // =====================================================================
    // 17. TIMER — per-subject countdown, updates both displays
    // =====================================================================
    function startTimer() {
        let endTimeStr = localStorage.getItem(timerKey);

        if (!endTimeStr) {
            const globalSettings = JSON.parse(localStorage.getItem("globalExamSettings"));
            let durationInMinutes = 60;
            if (globalSettings
                && globalSettings[user.stream]
                && globalSettings[user.stream][currentSubject]
                && globalSettings[user.stream][currentSubject].duration) {
                durationInMinutes = Number(globalSettings[user.stream][currentSubject].duration);
            }
            const newEndTime = Date.now() + (durationInMinutes * 60 * 1000);
            localStorage.setItem(timerKey, String(newEndTime));
            endTimeStr = String(newEndTime);
        }

        const endTime = parseInt(endTimeStr, 10);
        const timerInterval = setInterval(tick, 1000);

        function tick() {
            const distance = endTime - Date.now();

            if (distance <= 0) {
                clearInterval(timerInterval);
                const d1 = document.getElementById('timerDisplay');
                const d2 = document.getElementById('timerDisplayS');
                if (d1) d1.innerText = "00:00:00";
                if (d2) d2.innerText = "00:00:00";
                finishExam();
                return;
            }

            const hours   = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            const formatted = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

            const d1 = document.getElementById('timerDisplay');
            const d2 = document.getElementById('timerDisplayS');
            if (d1) d1.innerText = formatted;
            if (d2) d2.innerText = formatted;
        }

        tick();
        
    }

    // =====================================================================
    // 18. LEFT SIDEBAR — subject list
    // =====================================================================
    const streamSubjects = {
        "Natural Science": ["English", "Mathematics", "Physics", "Biology", "Scholastic aptitude test", "Chemistry"],
        "Social Science":  ["English", "Mathematics", "Geography", "History", "Scholastic aptitude test", "Economics"]
    };

    const availableExams   = streamSubjects[user.stream] || [];
    const streamHeader     = document.getElementById("streamItem");
    const sidebarContainer = document.getElementById("sidebar-subject-list");

    const streamTextEl = document.getElementById("sidebarStreamText");
    if (streamTextEl) streamTextEl.innerText = `${user.stream} Grade 12`;

    if (streamHeader) {
        streamHeader.style.cursor = "pointer";
        streamHeader.addEventListener("click", () => {
            window.location.href = "View.html";
            
        });
    }

    if (sidebarContainer) {
        sidebarContainer.innerHTML = "";
        availableExams.forEach(subject => {
            const item = document.createElement("div");
            item.className = "menu-item sidebar-sub-item";
            item.style.paddingLeft = "35px";
            item.style.cursor = "default";
            item.innerHTML = `<span>${subject}</span>`;
            item.classList.add(subject === currentSubject ? 'active' : 'inactive');
            sidebarContainer.appendChild(item);
        });
    }

    // =====================================================================
    // 19. RIGHT AND LEFT SIDEBAR TOGGLE
    // =====================================================================
  const arrowBtn = document.getElementById('arrowBtn');
  const sideBox = document.getElementById('butbox');
  const closeBtn = document.getElementById('closeBtn');

  function toggleElements() {
    sideBox.classList.toggle('hidden');
    arrowBtn.classList.toggle('hidden');
  }
  arrowBtn.addEventListener('click', toggleElements);
  closeBtn.addEventListener('click', toggleElements);

// --- Left Sidebar Logic ---
  const listBtn = document.getElementById('listBtn');
  const sideBoxl = document.getElementById('subli');
  const closeBtnl = document.getElementById('closeBtnl');
  
  function toggleLeftSide() {
    listBtn.classList.toggle('hidden');
    sideBoxl.classList.toggle('hidden');
  }
  listBtn.addEventListener('click', toggleLeftSide);
  closeBtnl.addEventListener('click', toggleLeftSide);

    // =====================================================================
    // 20. INITIAL LOAD
    // =====================================================================
    handleViewChange();
    startTimer();
});
    function showAttempt(examType) {
        hideAll();

        // Update breadcrumb
        document.getElementById('subjectExam').innerText = currentSubject;
        document.getElementById('bc-examtype').innerText  = examType;
        document.getElementById('bc-subject-link').onclick  = (e) => { e.preventDefault(); window.location.replace("View.html"); };

        // Update title
        document.getElementById('attemptTitle').innerText = `${currentSubject} — ${examType}`;
 }

