
    // Dropdown Logic
  function toggleDropdown(wrapperId) {
      document.querySelectorAll('.custom-select-wrapper').forEach(w => {
          if(w.id !== wrapperId) w.classList.remove('open');
      });
      document.getElementById(wrapperId).classList.toggle('open');
  }

  function selectOption(wrapperId, inputId, textId, value) {
      document.getElementById(inputId).value = value;
      document.getElementById(textId).innerText = value;
      document.getElementById(textId).style.color = "#fff"; // Make selected text white
      document.getElementById(wrapperId).classList.remove('open');
  }

  // Close dropdowns if clicked outside
  document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-wrapper')) {
          document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
      }
  });

  // Switch Logic
  function toggleSwitch(trackElement, hiddenInputId) {
      const drop = trackElement.querySelector('.glass-drop');
      const hiddenInput = document.getElementById(hiddenInputId);
      
      if (hiddenInput.value === "No") {
          drop.style.left = 'calc(100% - 35px)';
          drop.innerText = 'Yes';
          hiddenInput.value = 'Yes';
          drop.style.background = '#2f81d3'; // Highlight when active
          drop.style.color = '#fff';
      } else {
          drop.style.left = '2px';
          drop.innerText = 'No';
          hiddenInput.value = 'No';
          drop.style.background = 'rgba(255, 255, 255, 0.25)'; // Reset to glass
          drop.style.color = '#fff';
      }
  }

  // --- REGISTRATION LOGIC WITH CONFIRMATION POPUP ---
  let pendingUser = null; 

  document.getElementById("regForm").addEventListener("submit", function(e) {
      e.preventDefault(); 

      const username = document.getElementById("regId").value;
      const fullName = document.getElementById("regName").value;
      const center = document.getElementById("exTapls").value;
      const stream = document.getElementById("regStream").value;
      const type = document.getElementById("regEnrll").value;
      const deaf = document.getElementById("regDeaf").value;
      const blind = document.getElementById("regBlind").value;
      const checkEr = document.getElementById('checkagain');

      // Validation
      
      if (!stream || !type) {
          checkEr.style.fontSize = "13px";

          checkEr.style.color = "red";
          checkEr.style.display = "flex"
          setTimeout(() => { checkEr.style.display = "none"; }, 3000);
          
;
          return;
      }

      let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
      const exists = allUsers.find(u => u.username === username);
      if (exists) {
            document.getElementById("duplicated").style.display = 'flex';
            document.getElementById('backTo').addEventListener('click', () => {
            document.getElementById('duplicated').style.display = 'none';
            pendingUser = null; // Clear pending data
            });
          return;
      }
      
      
      
      // Generate 6-digit random password
      const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
      // Create the pending user object
      pendingUser = {
          username: username,
          password: randomPassword,
          originalPassword: randomPassword,
          fullName: fullName,
          stream: stream,
          school: "Chichu",
          center: center,
          deaf: deaf,
          blined: blind, 
          type: type,
          passwordChanged: false
      };

      // Populate the confirmation modal
      document.getElementById('confId').innerText = pendingUser.username;
      document.getElementById('confName').innerText = pendingUser.fullName;
      document.getElementById('confCenter').innerText = pendingUser.center;
      document.getElementById('confType').innerText = pendingUser.type;
      document.getElementById('confStream').innerText = pendingUser.stream;
      document.getElementById('confDeaf').innerText = pendingUser.deaf;
      document.getElementById('confBlind').innerText = pendingUser.blined;
      document.getElementById('confPass').innerText = pendingUser.password;

      // Show Modal
      document.getElementById('confirmModal').style.display = 'flex';
  });

  // Handle Edit Button
  document.getElementById('editBtn').addEventListener('click', () => {
      document.getElementById('confirmModal').style.display = 'none';
      pendingUser = null; // Clear pending data
  });

  // Handle Final Confirmation
  document.getElementById('finalSubmitBtn').addEventListener('click', () => {
      let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
      allUsers.push(pendingUser);
      localStorage.setItem("allUsers", JSON.stringify(allUsers));

      document.getElementById('confirmModal').style.display = 'none';
      document.getElementById("regMsg").style.display = "block";
      document.getElementById("regForm").reset();
      
      // Reset Custom UI elements
      document.getElementById("enrollText").innerText = "Enrollment type";
      document.getElementById("streamText").innerText = "Stream";
      document.querySelectorAll('.glass-drop').forEach(drop => {
          drop.style.left = '2px';
          drop.innerText = 'No';
          drop.style.background = 'rgba(255, 255, 255, 0.25)';
      });
      document.getElementById("regDeaf").value = "No";
      document.getElementById("regBlind").value = "No";

      setTimeout(() => { document.getElementById("regMsg").style.display = "none"; }, 3000);
      pendingUser = null;
  });




    document.getElementById('bulkUpload').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = function(loadEvent) {
      const arrayBuffer = loadEvent.target.result;
      
      // Use Mammoth to convert the .docx to an HTML string
      mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then(function(result) {
              processDocxTable(result.value);
          })
          .catch(function(err) {
              console.error("Error reading docx:", err);
              alert("Failed to read the document. Make sure it's a valid .docx file.");
          });
  };
  
  reader.readAsArrayBuffer(file);
});

function processDocxTable(htmlString) {
  // Create a temporary, invisible div to parse the HTML created by Mammoth
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  
  // Find all table rows generated from the Word document
  const rows = tempDiv.querySelectorAll('tr');
  
  if (rows.length < 2) {
      alert("No valid table data found in the document.");
      return;
  }
  
  // Pull your existing database[cite: 4]
  let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  let addedCount = 0;
  let duplicateCount = 0;
  
  for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td, th');
      

      if (cells.length < 8) continue;
      
      const username = cells[0].innerText.trim();
      
      if (allUsers.find(u => u.username === username)) {
          duplicateCount++;
          continue;
      }
      
      const docxPassword = cells[7].innerText.trim();
      const newUser = {
          username: username,
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
  // Save back to the database[cite: 4]
  localStorage.setItem("allUsers", JSON.stringify(allUsers));
  
  // Provide feedback to the admin
  showUploadResult(addedCount, duplicateCount);
  
  // Clear the file input so it can be used again
  document.getElementById('bulkUpload').value = "";
}


// --- NEW Helper Functions ---

function showUploadResult(added, duplicates) {
  const statusBox = document.getElementById('uploadStatusModal');
  const resultDisplay = document.getElementById('uploadResultText');
  
  // Injecting the data into the modal structure
  resultDisplay.innerHTML = `
      <p style="font-size: 16px; color: green">Successfully Added: <strong>${added}</strong></p>
      <p style="font-size: 16px; color: #ffadad;">Skipped (Duplicates): <strong>${duplicates}</strong></p>
  `;
  
  statusBox.style.display = 'flex';
}

function closeUploadModal() {
  document.getElementById('uploadStatusModal').style.display = 'none';
  document.getElementById('bulkUpload').value = ""; // Clear the file input
  // Optional: Reload to see the new students in the dashboard
  // location.reload(); 
}