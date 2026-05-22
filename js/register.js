// ============================================================
//  register.js  —  REGISTRATION PAGE  (Firebase version)
//  Includes: single registration + bulk .docx upload
// ============================================================

// ---------- Dropdown UI helpers ----------
function toggleDropdown(wrapperId) {
    document.querySelectorAll('.custom-select-wrapper').forEach(w => {
        if (w.id !== wrapperId) w.classList.remove('open');
    });
    document.getElementById(wrapperId).classList.toggle('open');
}

function selectOption(wrapperId, inputId, textId, value) {
    document.getElementById(inputId).value = value;
    document.getElementById(textId).innerText = value;
    document.getElementById(textId).style.color = "#fff";
    document.getElementById(wrapperId).classList.remove('open');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
    }
});

// ---------- Switch UI helper ----------
function toggleSwitch(trackElement, hiddenInputId) {
    const drop = trackElement.querySelector('.glass-drop');
    const hiddenInput = document.getElementById(hiddenInputId);

    if (hiddenInput.value === "No") {
        drop.style.left       = 'calc(100% - 35px)';
        drop.innerText        = 'Yes';
        hiddenInput.value     = 'Yes';
        drop.style.background = '#2f81d3';
        drop.style.color      = '#fff';
    } else {
        drop.style.left       = '2px';
        drop.innerText        = 'No';
        hiddenInput.value     = 'No';
        drop.style.background = 'rgba(255, 255, 255, 0.25)';
        drop.style.color      = '#fff';
    }
}

// ============================================================
//  SINGLE REGISTRATION
// ============================================================

let pendingUser = null;

document.getElementById("regForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("regId").value.trim();
    const fullName = document.getElementById("regName").value.trim();
    const center   = document.getElementById("exTapls").value;
    const stream   = document.getElementById("regStream").value;
    const type     = document.getElementById("regEnrll").value;
    const deaf     = document.getElementById("regDeaf").value;
    const blind    = document.getElementById("regBlind").value;
    const checkEr  = document.getElementById('checkagain');

    // Validation
    if (!stream || !type) {
        checkEr.style.fontSize = "13px";
        checkEr.style.color    = "red";
        checkEr.style.display  = "flex";
        setTimeout(() => { checkEr.style.display = "none"; }, 3000);
        return;
    }

    // Check duplicate in Firebase
    try {
        const snapshot = await db.ref("users/" + username).once("value");
        if (snapshot.exists()) {
            document.getElementById("duplicated").style.display = 'flex';
            document.getElementById('backTo').addEventListener('click', () => {
                document.getElementById('duplicated').style.display = 'none';
                pendingUser = null;
            });
            return;
        }
    } catch (err) {
        console.error("Duplicate check error:", err);
        alert("Connection error. Please check your internet and try again.");
        return;
    }

    // Generate 6-digit random password
    const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();

    pendingUser = {
        username:        username,
        password:        randomPassword,
        orginalPassword: randomPassword,   // kept same key as original
        fullName:        fullName,
        stream:          stream,
        school:          "Chichu",
        center:          center,
        deaf:            deaf,
        blined:          blind,
        type:            type,
        passwordChanged: false
    };

    // Populate confirmation modal
    document.getElementById('confId').innerText     = pendingUser.username;
    document.getElementById('confName').innerText   = pendingUser.fullName;
    document.getElementById('confCenter').innerText = pendingUser.center;
    document.getElementById('confType').innerText   = pendingUser.type;
    document.getElementById('confStream').innerText = pendingUser.stream;
    document.getElementById('confDeaf').innerText   = pendingUser.deaf;
    document.getElementById('confBlind').innerText  = pendingUser.blined;
    document.getElementById('confPass').innerText   = pendingUser.password;

    document.getElementById('confirmModal').style.display = 'flex';
});

// Edit button — go back
document.getElementById('editBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').style.display = 'none';
    pendingUser = null;
});

// Final confirm — SAVE TO FIREBASE
document.getElementById('finalSubmitBtn').addEventListener('click', async () => {
    if (!pendingUser) return;

    try {
        await db.ref("users/" + pendingUser.username).set(pendingUser);

        document.getElementById('confirmModal').style.display = 'none';
        document.getElementById("regMsg").style.display       = "block";
        document.getElementById("regForm").reset();

        // Reset custom UI elements
        document.getElementById("enrollText").innerText = "Enrollment type";
        document.getElementById("streamText").innerText = "Stream";
        document.querySelectorAll('.glass-drop').forEach(drop => {
            drop.style.left       = '2px';
            drop.innerText        = 'No';
            drop.style.background = 'rgba(255, 255, 255, 0.25)';
        });
        document.getElementById("regDeaf").value  = "No";
        document.getElementById("regBlind").value = "No";

        setTimeout(() => { document.getElementById("regMsg").style.display = "none"; }, 3000);
        pendingUser = null;

    } catch (err) {
        console.error("Registration save error:", err);
        alert("Failed to save. Check your internet connection and try again.");
    }
});

// ============================================================
//  BULK UPLOAD (.docx file)
// ============================================================

document.getElementById('bulkUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (loadEvent) {
        const arrayBuffer = loadEvent.target.result;

        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function (result) {
                processDocxTable(result.value);
            })
            .catch(function (err) {
                console.error("Error reading docx:", err);
                alert("Failed to read the document. Make sure it's a valid .docx file.");
            });
    };

    reader.readAsArrayBuffer(file);
});

async function processDocxTable(htmlString) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    const rows = tempDiv.querySelectorAll('tr');

    if (rows.length < 2) {
        alert("No valid table data found in the document.");
        return;
    }

    let addedCount     = 0;
    let duplicateCount = 0;
    const savePromises = [];

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td, th');
        if (cells.length < 8) continue;

        const username = cells[0].innerText.trim();

        // Check if user already exists in Firebase
        let alreadyExists = false;
        try {
            const snap = await db.ref("users/" + username).once("value");
            alreadyExists = snap.exists();
        } catch (err) {
            console.warn("Could not check duplicate for", username, err);
        }

        if (alreadyExists) {
            duplicateCount++;
            continue;
        }

        const docxPassword = cells[7].innerText.trim();
        const newUser = {
            username:        username,
            password:        docxPassword,
            orginalPassword: docxPassword,
            fullName:        cells[1].innerText.trim(),
            center:          cells[2].innerText.trim(),
            type:            cells[3].innerText.trim(),
            stream:          cells[4].innerText.trim(),
            deaf:            cells[5].innerText.trim(),
            blined:          cells[6].innerText.trim(),
            school:          "Chichu",
            passwordChanged: false
        };

        // Save each user to Firebase
        savePromises.push(
            db.ref("users/" + username).set(newUser)
              .then(() => { addedCount++; })
              .catch(err => { console.error("Failed to save user:", username, err); })
        );
    }

    // Wait for all saves to complete
    await Promise.all(savePromises);

    showUploadResult(addedCount, duplicateCount);
    document.getElementById('bulkUpload').value = "";
}

function showUploadResult(added, duplicates) {
    const statusBox     = document.getElementById('uploadStatusModal');
    const resultDisplay = document.getElementById('uploadResultText');

    resultDisplay.innerHTML = `
        <p style="font-size: 16px; color: green">Successfully Added: <strong>${added}</strong></p>
        <p style="font-size: 16px; color: #ffadad;">Skipped (Duplicates): <strong>${duplicates}</strong></p>
    `;

    statusBox.style.display = 'flex';
}

function closeUploadModal() {
    document.getElementById('uploadStatusModal').style.display = 'none';
    document.getElementById('bulkUpload').value = "";
                                                        }
