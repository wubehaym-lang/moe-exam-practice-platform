    const user = JSON.parse(sessionStorage.getItem("currentUser"));
  
  if (!user) {
      window.location.href = 'index.html';
  } else {
      // If a different student logs in on the same browser, clear the old session page state
      // so they do not inherit the previous student's place in the exam flow.
      const sessionOwnerKey = 'examSessionOwner';
      const previousOwner = sessionStorage.getItem(sessionOwnerKey);
      if (previousOwner && previousOwner !== user.username) {
          sessionStorage.removeItem('currentPage');
          sessionStorage.removeItem('examData');
          sessionStorage.removeItem('currentIndex');
          sessionStorage.removeItem('currentStream');
      }
      sessionStorage.setItem(sessionOwnerKey, user.username);

      // FIX: This now correctly replaces "WUBSHET HAYMANOT" with whoever logged in
      document.getElementById("nameTitle").innerText = user.fullName.toUpperCase();
      if (typeof updateAvatars === "function") {
          updateAvatars(user.fullName);
      }
  }
  

  const popup = document.getElementById('popup');
  const openBtn = document.getElementById('openBtn');
  const closepop = document.getElementById('closBtn');
  const closepo = document.getElementById('closBtnb');
  const startAttembutton = document.getElementById('stratm');
  const examPassword = document.getElementById('exampass');
  const error = document.getElementById('errorMsg');

  openBtn.addEventListener('click', () =>{
    popup.style.display = "flex";
    examPassword.value = '';
    error.style.display = "none";
    examPassword.focus();
  });
  const hidepop = () =>{
    popup.style.display = "none";
  }
  closepop.addEventListener('click', hidepop);
  closepo.addEventListener('click', hidepop)
  
window.addEventListener('click', (event) => {
    if(event.target === popup){
        hidepop();
    }
})







  const savedTime = localStorage.getItem("userLogintime");

  if (savedTime) {
    document.getElementById('todayLogintime').innerText = savedTime;
  } else {
    document.getElementById('todayLogintime').innerText = "No logged in";
  }

    // FUNCTION to apply the "Finished" UI
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user) return; // FIX 1: Fixed the typo "reourn"

    // 1. INJECT TODAY'S LOGIN (Right Sidebar)
    const todayLoginEl = document.getElementById('todayLogintime');
    if (todayLoginEl) {
        todayLoginEl.innerText = user.currentLogin || "Just now";
    }
});



const arrowBtn = document.getElementById('arrowBtn');
    const sideBox = document.getElementById('butbox');
    const closeBtn = document.getElementById('closeBtn');

    // Function to swap visibility
    function toggleElements() {
      sideBox.classList.toggle('hidden');
      arrowBtn.classList.toggle('hidden');
    }
    arrowBtn.addEventListener('click', toggleElements);
    closeBtn.addEventListener('click', toggleElements);
    