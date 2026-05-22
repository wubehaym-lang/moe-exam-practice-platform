// ============================================================
//  register.js  —  REGISTRATION PAGE  (Firebase version)
// ============================================================

// ---------- Dropdown UI helpers (unchanged) ----------
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

// ---------- Switch UI helper (unchanged) ----------
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

// ---------- Registration logic ----------
let pendingUser = null;

document.getElementById("regForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username  = document.getElementById("regId").value.trim();
    const fullName  = document.getElementById("regName").value.trim();
    const center    = document.getElementById("exTapls").value;
    const stream    = document.getElementById("regStream").value;
    const type      = document.getElementById("regEnrll").value;
    const deaf      = document.getElementById("regDeaf").value;
    const blind     = document.getElementById("regBlind").value;
    const examTime  = document.getElementById("regTime").value;
    const checkEr   = document.getElementById('checkagain');

    if (!stream || !type) {
        checkEr.style.fontSize  = "13px";
        checkEr.style.color     = "red";
        checkEr.style.display   = "flex";
        setTimeout(() => { checkEr.style.display = "none"; }, 3000);
        return;
    }

    // --- Check if username already exists in Firebase ---
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

    // --- Build pending user ---
    const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();

    pendingUser = {
        username:        username,
        password:        randomPassword,
        originalPassword: randomPassword,
        fullName:        fullName,
        stream:          stream,
        school:          "Chichu",
        center:          center,
        deaf:            deaf,
        blined:          blind,
        type:            type,
        examDuration:    parseInt(examTime),
        passwordChanged: false
    };

    // --- Populate confirmation modal ---
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

// --- Edit button ---
document.getElementById('editBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').style.display = 'none';
    pendingUser = null;
});

// --- Final confirm: SAVE TO FIREBASE ---
document.getElementById('finalSubmitBtn').addEventListener('click', async () => {
    if (!pendingUser) return;

    try {
        // Save to Firebase under users/<username>
        await db.ref("users/" + pendingUser.username).set(pendingUser);

        document.getElementById('confirmModal').style.display = 'none';
        document.getElementById("regMsg").style.display       = "block";
        document.getElementById("regForm").reset();

        // Reset custom UI elements
        document.getElementById("enrollText").innerText  = "Enrollment type";
        document.getElementById("streamText").innerText  = "Stream";
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
