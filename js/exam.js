document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA & SECURITY INITIALIZATION
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    const currentSubject = sessionStorage.getItem("currentSubject");

    // Security check: Redirect if no user or subject is selected
    if (!user || !currentSubject) {
        window.location.replace("index.html");
        return;
    }

    // Check if this specific exam was already finished
    const finishKey = `examFinished_${user.username}_${currentSubject}`;
    if (localStorage.getItem(finishKey) === 'true') {
        window.location.replace("View.html");
        return;
    }

    // 2. LOAD EXAM DATA
    // Pull from questionBank (ensure questionbank.js is loaded in HTML before this script)
    const defaultExamData = (questionBank[user.stream] && questionBank[user.stream][currentSubject]) 
                            ? questionBank[user.stream][currentSubject] 
                            : [];

    let examData = JSON.parse(sessionStorage.getItem('examData'));
    let savedSubject = sessionStorage.getItem('savedSubject');
    let currentIndex = parseInt(sessionStorage.getItem('currentIndex')) || 0;

    // Reset data if it's a new subject or no saved data exists
    if (!examData || savedSubject !== currentSubject) {
        examData = JSON.parse(JSON.stringify(defaultExamData)); 
        currentIndex = 0;
        sessionStorage.setItem('savedSubject', currentSubject);
    }

    // 3. POPULATE UI HEADERS
   // document.getElementById("display-id").innerText = user.username;
    document.getElementById("Subject").innerText = currentSubject;
    document.getElementById("main-subject-title").innerText = currentSubject;
    document.title = `${user.stream} Exam - ${currentSubject}`;

    // Update your saveState function to include the stream
    function saveState() {
    sessionStorage.setItem('examData', JSON.stringify(examData));
    sessionStorage.setItem('currentIndex', currentIndex);
    sessionStorage.setItem('currentStream', user.stream);
}

  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const queNoDisplay = document.getElementById('queNo');
  const gridContainer = document.getElementById('question-grid');

  // 2. The Core Navigation Logic (Handles the "Wait till click" shading)
  function navigateTo(newIndex) {
      // Before we leave the current question, check if it should be shaded
      const currentQ = examData[currentIndex];
      if (currentQ.answer !== null) {
          currentQ.isShaded = true;
      } else {
          currentQ.isShaded = false;
      }

      // Now move to the new question
      currentIndex = newIndex;
      saveState();
      window.location.hash = ''; 
      loadQuestion(currentIndex);
  }

    // 4. CORE DISPLAY FUNCTIONS
      function loadQuestion(index) {
      const q = examData[index];
      queNoDisplay.textContent = index + 1;
      questionText.textContent = q.question;

      document.getElementById('prePage').style.visibility = (index === 0) ? 'hidden' : 'visible'; 
      const nextBtn = document.getElementById('nexPag');
      nextBtn.textContent = (index === examData.length - 1) ? "Finish attempt..." : "Next page";

      const statusText = document.getElementById('notYet');
      statusText.textContent = (q.answer !== null) ? "Answer saved" : "Not yet answered";

      const btnTxt = document.getElementById('btnTxt');
      const btnIcon = document.getElementById('btnIcon');
      if (q.isFlagged) {
          btnTxt.textContent = "Remove flag";
          btnIcon.src = "icon/red.png";
      } else {
          btnTxt.textContent = "Flag question";
          btnIcon.src = "icon/just.png";
      }
      
      optionsContainer.innerHTML = '';
      const clearBtn = document.createElement('p');
      clearBtn.textContent = 'Clear my choice';
      clearBtn.className = 'clear-choice';
      clearBtn.style.display = (q.answer !== null) ? 'block' : 'none'; 
      clearBtn.onclick = () => {
          q.answer = null; 
          // Note: We don't change isShaded here, so the shade stays until they move
          saveState(); 
          loadQuestion(currentIndex); 
          updateSidebar();
      };

      q.options.forEach((opt, i) => {
          const row = document.createElement('div');
          row.className = 'option-row';
          const isChecked = q.answer === i;
          const isDisabled = (q.answer !== null) ? 'disabled' : '';
          row.innerHTML = `<input type="radio" name="q-opt" value="${i}" ${isChecked ? 'checked' : ''} ${isDisabled}> <span>${opt}</span>`;
          
          const radioInput = row.querySelector('input');
          radioInput.addEventListener('change', () => { 
              q.answer = i; 
              saveState();
              // Do NOT call updateSidebar here. Shading waits for navigation.
              const allRadios = optionsContainer.querySelectorAll('input[type="radio"]');
              allRadios.forEach(radio => radio.disabled = true);
              clearBtn.style.display = 'block';
          });
          optionsContainer.appendChild(row);
      });
       optionsContainer.appendChild(clearBtn);
       updateSidebar();
  }

 // 4. Sidebar Grid
  function updateSidebar() {
      const finishBtn = document.getElementById('finish');
      gridContainer.innerHTML = ''; 
      
      examData.forEach((q, i) => {
          const btn = document.createElement('button');
          btn.className = 'bx';
          if (i === currentIndex) btn.classList.add('current');
          if (q.isFlagged) btn.classList.add('flagged');
          if (q.isShaded) btn.classList.add('answered');
          
          const p2 = document.createElement('span');
          p2.className = 'p2';
          btn.innerHTML = `<p>${i + 1}</p>`;
          btn.appendChild(p2);
          btn.onclick = () => { navigateTo(i); };
          gridContainer.appendChild(btn);
      });

      if (finishBtn) gridContainer.appendChild(finishBtn);
  }

  // 5. Button Handlers
  document.getElementById('nexPag').onclick = () => {
      if (currentIndex < examData.length - 1) {
          navigateTo(currentIndex + 1);
      } else {
          // FIX: Save shade on last page before going to summary
          if (examData[currentIndex].answer !== null) examData[currentIndex].isShaded = true;
          saveState(); 
          window.location.hash = 'summary';
      }
  };
 document.getElementById('finishAttemptBtn').onclick = () => showSummary();
  document.getElementById('prePage').onclick = () => {
      if (currentIndex > 0) navigateTo(currentIndex - 1);
  };

  document.getElementById('colorBtn').onclick = () => {
      examData[currentIndex].isFlagged = !examData[currentIndex].isFlagged; 
      saveState();
      loadQuestion(currentIndex);
      updateSidebar(); 
  };

 

  function handleViewChange() {
      if (window.location.hash === '#summary') {
          document.getElementById('question-view').style.display = 'none';
          document.getElementById('summary-view').style.display = 'flex';
          buildSummaryTable();
          updateSidebar(); 

         // DYNAMIC TARGET TIME CALCULATION
          const user = JSON.parse(sessionStorage.getItem("currentUser"));
          
          // Use the new branded key we created in Step 1
          const timerKey = 'examEndTime_' + user.username; 
          const endTimeStr = localStorage.getItem(timerKey); 
          
          if (endTimeStr) {
              const endDate = new Date(parseInt(endTimeStr));
              const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
              
              const dateTimeSpan = document.getElementById('dateTime');
              if (dateTimeSpan) {
                  dateTimeSpan.innerText = endDate.toLocaleString('en-GB', options);
              }
          }

      } else {
          document.getElementById('summary-view').style.display = 'none';
          document.getElementById('question-view').style.display = 'flex';
          loadQuestion(currentIndex);
      }
  }
  
  function buildSummaryTable() {
      const tbody = document.getElementById('summary-tbody');
      tbody.innerHTML = ''; 
      examData.forEach((q, index) => {
          const tr = document.createElement('tr');
          const flagIcon = q.isFlagged ? '<img src="icon/red.png" style="width:12px; margin-left:5px;">' : '';
          const statusText = (q.answer !== null) ? 'Answer saved' : 'Not yet answered';
          tr.innerHTML = `
              <td class="jump" style="cursor:pointer; color:#2f81d3; font-weight:bold;">${index + 1} ${flagIcon}</td>
              <td>${statusText}</td>
          `;
          tr.querySelector('.jump').onclick = () => { navigateTo(index); };
          tbody.appendChild(tr);
      });
  }
  document.getElementById('return-btn').onclick = () => { window.location.hash = ''; };

  window.addEventListener('hashchange', handleViewChange);
  handleViewChange();

// FIX: both back buttons return to the attempt page in View.html
const backButtons = document.querySelectorAll('.exam-back');
backButtons.forEach((btn) => {
    btn.addEventListener('click', goBackToAttemptPage);
});
function goBackToAttemptPage() {
    sessionStorage.setItem('currentPage', 'chemistry');
    window.location.replace('View.html');
}
// FIX: make the left sidebar behave like the View.html navigation
const examSideOverview = document.getElementById('exam-side-overview');
//const examSideSummary = document.getElementById('exam-side-summary');
if (examSideOverview) {
    examSideOverview.addEventListener('click', () => {
        window.location.hash = '';
        handleViewChange();
    });
}

    function updateGrid() {
        const gridContainer = document.getElementById('question-grid');
        gridContainer.innerHTML = '';
        examData.forEach((q, i) => {
            const btn = document.createElement('div');
            btn.className = 'grid-item';
            if (q.answer !== null) btn.classList.add('answered'); // Color blue if answered
            if (i === currentIndex) btn.classList.add('current'); // Highlight current
            
            btn.innerText = i + 1;
            btn.onclick = () => loadQuestion(i);
            gridContainer.appendChild(btn);
        });
    }
    // 1. Select the elements
const modal = document.getElementById('confirmation-modal');
const summarySubmitBtn = document.querySelector('.suma.sub'); // The button on the summary page
const finalSubmitBtn = document.getElementById('final-submit-btn'); // The button inside the popup
const cancelBtn = document.getElementById('cancel-modal-btn');
const closeX = document.getElementById('close-x');

// 2. Show the modal when the summary submit button is clicked
summarySubmitBtn.onclick = () => {
    modal.style.display = 'flex';
};

// 3. Hide the modal if 'Cancel' or the 'X' is clicked
const hideModal = () => {
    modal.style.display = 'none';
};

cancelBtn.onclick = hideModal;
closeX.onclick = hideModal;

// 4. Hide modal if user clicks outside of the white box
window.onclick = (event) => {
    if (event.target == modal) {
        hideModal();
    }
};

//5. --- TIMER LOGIC ---

// 1. CREATE A REUSABLE FINISH FUNCTION
function finishExam() {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    const finishTime = new Date().toLocaleString('en-GB', options);

    if (user) {
        localStorage.setItem('examFinished_' + user.username, 'true');
        localStorage.setItem('finishTime_' + user.username, finishTime);
    }

    sessionStorage.removeItem('examData');
    // FIX: keep the attempt page on chemistry for the same browser session
    sessionStorage.setItem('currentPage', 'chemistry');
    // Use .replace so they can't click "Back" to return here
    window.location.replace('.html'); 
}



finalSubmitBtn.onclick = finishExam;

//here the time have to taken from only the admin from allowed 



function startTimer() {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user) return;

    const timerKey = 'examEndTime_' + user.username;
    let endTimeStr = localStorage.getItem(timerKey);

    if (!endTimeStr) {
        // Use the duration set by Admin, or default to 60
        const durationInMinutes = user.examDuration; 
        const newEndTime = new Date().getTime() + (durationInMinutes * 60 * 1000);
        localStorage.setItem(timerKey, newEndTime);
        endTimeStr = newEndTime;
    }

    const endTime = parseInt(endTimeStr);

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timerDisplay').innerText = "00:00:00";
            // NO LERT HERE - just finish the exam immediately
            finishExam(); 
        } else {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('timerDisplay').innerText = formattedTime;
            if(document.getElementById('timerDisplayS')) document.getElementById('timerDisplayS').innerText = formattedTime;
        }
    }, 1000);

  }

      // 3. SIDEBAR LOGIC (Copied from View.html style)
    const streamHeader = document.getElementById("streamItem");
    const sidebarContainer = document.getElementById("sidebar-subject-list");
    const streamSubjects = {
        "Natural Science": ["English", "Mathematics", "Physics", "Biology", "Scholastic aptitude test", "Chemistry"],
        "Social Science": ["English", "Mathematics", "Geography", "History", "Scholastic aptitude test", "Economics"]
    };
    const availableExams = streamSubjects[user.stream] || [];

    // Header logic: Go back to View.html
    document.getElementById("sidebarStreamText").innerText = `${user.stream} Grade 12`;
    streamHeader.style.cursor = "pointer";
    streamHeader.addEventListener("click", () => {
        if(confirm("Are you sure you want to leave the exam? Your progress is saved.")) {
            window.location.href = "View.html";
        }
    });
  sidebarContainer.innerHTML = "";
    availableExams.forEach(subject => {
        const item = document.createElement("div");
        item.className = "menu-item sidebar-sub-item";
        item.style.paddingLeft = "35px";
        item.style.cursor = "default"; // Shows user they can't click
        item.innerHTML = `<span>${subject}</span>`;

        // Only make the CURRENT subject active
        if (subject === currentSubject) {
            item.classList.add('active');
        } else {
            item.classList.add('inactive');
        }
        sidebarContainer.appendChild(item);
    });


    // 5. NAVIGATION & FINISH LOGIC
    document.getElementById('complet').onclick = () => {
        document.getElementById('confirmation-modal').style.display = 'flex';
    };
   

    document.getElementById('final-submit-btn').onclick = () => {
        localStorage.setItem(finishKey, 'true');
        // Optional: Save final results to a global 'allResults' object here
        window.location.replace("View.html");
    };

    document.getElementById('cancel-modal-btn').onclick = () => {
        document.getElementById('confirmation-modal').style.display = 'none';
    };

    // Initial Load
    loadQuestion(currentIndex);
    updateGrid();
    startTimer(); // Assuming your timer function is defined below or in another file
});