
function toggleDropdown(wrapperId) {
  document.querySelectorAll(".custom-select-wrapper").forEach(w => {
    if (w.id !== wrapperId) w.classList.remove("open");
  });
  const target = document.getElementById(wrapperId);
  if (target) target.classList.toggle("open");
}

function selectOption(wrapperId, inputId, textId, value) {
  const input = document.getElementById(inputId);
  const text = document.getElementById(textId);
  const wrapper = document.getElementById(wrapperId);
  if (input) input.value = value;
  if (text) {
    text.innerText = value;
    text.style.color = "var(--text)";
  }
  if (wrapper) wrapper.classList.remove("open");
}

async function waitForSync() {
  if (window.appwriteMirrorReady) {
    await window.appwriteMirrorReady;
  }
  if (window.appwriteMirror && typeof window.appwriteMirror.waitForWrites === "function") {
    await window.appwriteMirror.waitForWrites();
  }
}

function showSaving(message = "Saving") {
  if (window.appwriteMirror && window.appwriteMirror.showSaving) {
    window.appwriteMirror.showSaving(message);
  }
}

function hideSaving() {
  if (window.appwriteMirror && window.appwriteMirror.hideSaving) {
    window.appwriteMirror.hideSaving();
  }
}

document.addEventListener("click", e => {
  if (!e.target.closest(".custom-select-wrapper")) {
    document.querySelectorAll(".custom-select-wrapper").forEach(w => w.classList.remove("open"));
  }
});

function toggleSwitch(trackElement, hiddenInputId) {
  const drop = trackElement.querySelector(".glass-drop");
  const hiddenInput = document.getElementById(hiddenInputId);
  if (!drop || !hiddenInput) return;

  const nextYes = hiddenInput.value !== "Yes";
  hiddenInput.value = nextYes ? "Yes" : "No";
  drop.innerText = nextYes ? "Yes" : "No";
  drop.style.left = nextYes ? "calc(100% - 37px)" : "3px";
  drop.style.background = nextYes ? "var(--primary)" : "var(--surface-strong)";
  drop.style.color = nextYes ? "#fff" : "var(--text)";
}

let pendingUser = null;

document.getElementById("regForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("regId").value.trim();
  const fullName = document.getElementById("regName").value.trim();
  const center = document.getElementById("exTapls").value.trim();
  const stream = document.getElementById("regStream").value;
  const type = document.getElementById("regEnrll").value;
  const deaf = document.getElementById("regDeaf").value;
  const blind = document.getElementById("regBlind").value;
  const checkEr = document.getElementById("checkagain");

  if (!stream || !type) {
    checkEr.style.fontSize = "13px";
    checkEr.style.color = "#d94b4b";
    checkEr.style.display = "flex";
    setTimeout(() => { checkEr.style.display = "none"; }, 2500);
    return;
  }

  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  const exists = allUsers.find(u => u.username === username);
  if (exists) {
    const dup = document.getElementById("duplicated");
    if (dup) dup.style.display = "flex";
    const backBtn = document.getElementById("backTo");
    if (backBtn) {
      backBtn.onclick = () => {
        if (dup) dup.style.display = "none";
        pendingUser = null;
      };
    }
    return;
  }

  const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
  pendingUser = {
    username,
    password: randomPassword,
    originalPassword: randomPassword,
    fullName,
    stream,
    school: "Chichu",
    center,
    deaf,
    blined: blind,
    type,
    passwordChanged: false
  };

  document.getElementById("confId").innerText = pendingUser.username;
  document.getElementById("confName").innerText = pendingUser.fullName;
  document.getElementById("confCenter").innerText = pendingUser.center;
  document.getElementById("confType").innerText = pendingUser.type;
  document.getElementById("confStream").innerText = pendingUser.stream;
  document.getElementById("confDeaf").innerText = pendingUser.deaf;
  document.getElementById("confBlind").innerText = pendingUser.blined;
  document.getElementById("confPass").innerText = pendingUser.password;

  document.getElementById("confirmModal").style.display = "flex";
});

document.getElementById("editBtn").addEventListener("click", () => {
  document.getElementById("confirmModal").style.display = "none";
  pendingUser = null;
});

document.getElementById("finalSubmitBtn").addEventListener("click", async () => {
  if (!pendingUser) return;

  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  allUsers.push(pendingUser);
  localStorage.setItem("allUsers", JSON.stringify(allUsers));

  showSaving("Saving student");
  try {
    await waitForSync();
  } finally {
    hideSaving();
  }

  document.getElementById("confirmModal").style.display = "none";
  document.getElementById("regMsg").style.display = "block";
  document.getElementById("regForm").reset();

  document.getElementById("enrollText").innerText = "Enrollment type";
  document.getElementById("enrollText").style.color = "";
  document.getElementById("streamText").innerText = "Stream";
  document.getElementById("streamText").style.color = "";

  document.querySelectorAll(".glass-drop").forEach(drop => {
    drop.style.left = "3px";
    drop.innerText = "No";
    drop.style.background = "var(--surface-strong)";
    drop.style.color = "var(--text)";
  });

  document.getElementById("regDeaf").value = "No";
  document.getElementById("regBlind").value = "No";

  setTimeout(() => { document.getElementById("regMsg").style.display = "none"; }, 2500);
  pendingUser = null;
});

document.getElementById("bulkUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(loadEvent) {
    const arrayBuffer = loadEvent.target.result;
    mammoth.convertToHtml({ arrayBuffer })
      .then(result => processDocxTable(result.value).catch(err => console.error("Bulk upload failed:", err)))
      .catch(err => {
        console.error("Error reading docx:", err);
        alert("Failed to read the document. Make sure it's a valid .docx file.");
      });
  };
  reader.readAsArrayBuffer(file);
});

async function processDocxTable(htmlString) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  const rows = tempDiv.querySelectorAll("tr");
  if (rows.length < 2) {
    alert("No valid table data found in the document.");
    return;
  }

  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  let addedCount = 0;
  let duplicateCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td, th");
    if (cells.length < 8) continue;

    const username = cells[0].innerText.trim();
    if (allUsers.find(u => u.username === username)) {
      duplicateCount++;
      continue;
    }

    const docxPassword = cells[7].innerText.trim();
    const newUser = {
      username,
      password: docxPassword,
      originalPassword: docxPassword,
      fullName: cells[1].innerText.trim(),
      center: cells[2].innerText.trim(),
      type: cells[3].innerText.trim(),
      stream: cells[4].innerText.trim(),
      deaf: cells[5].innerText.trim(),
      blined: cells[6].innerText.trim(),
      school: "Chichu",
      passwordChanged: false
    };

    allUsers.push(newUser);
    addedCount++;
  }

  localStorage.setItem("allUsers", JSON.stringify(allUsers));

  showSaving("Uploading");
  try {
    await waitForSync();
  } finally {
    hideSaving();
  }

  showUploadResult(addedCount, duplicateCount);
  document.getElementById("bulkUpload").value = "";
}

function showUploadResult(added, duplicates) {
  const statusBox = document.getElementById("uploadStatusModal");
  const resultDisplay = document.getElementById("uploadResultText");
  resultDisplay.innerHTML = `
    <p style="font-size:16px;color:#1f9d63;">Successfully Added: <strong>${added}</strong></p>
    <p style="font-size:16px;color:#d94b4b;">Skipped (Duplicates): <strong>${duplicates}</strong></p>
  `;
  statusBox.style.display = "flex";
}

function closeUploadModal() {
  document.getElementById("uploadStatusModal").style.display = "none";
  document.getElementById("bulkUpload").value = "";
}
