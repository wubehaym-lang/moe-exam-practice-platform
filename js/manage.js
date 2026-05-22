// ============================================================
//  manage.js  —  ADMIN MANAGE EXAMS PAGE  (Firebase version)
// ============================================================

const defaultExamSettings = {
    "Natural Science": {
        "English":                { duration: 10, password: "eng",  verified: false },
        "Mathematics":            { duration: 10, password: "math", verified: false },
        "Physics":                { duration: 10, password: "phy",  verified: false },
        "Biology":                { duration: 10, password: "bio",  verified: false },
        "Scholastic aptitude test":{ duration: 10, password: "sat", verified: false },
        "Chemistry":              { duration: 10, password: "chem", verified: false }
    },
    "Social Science": {
        "English":                { duration: 10, password: "eng",  verified: false },
        "Mathematics":            { duration: 10, password: "math", verified: false },
        "Geography":              { duration: 10, password: "geo",  verified: false },
        "History":                { duration: 10, password: "his",  verified: false },
        "Scholastic aptitude test":{ duration: 10, password: "sat", verified: false },
        "Economics":              { duration: 10, password: "eco",  verified: false }
    }
};

let currentManageStream = "Natural Science";
let cachedSettings = null; // local cache to avoid repeated reads

// ---- Load settings from Firebase ----
async function getSettings() {
    if (cachedSettings) return cachedSettings;

    try {
        const snapshot = await db.ref("globalExamSettings").once("value");

        if (snapshot.exists()) {
            cachedSettings = snapshot.val();
        } else {
            // First run: write defaults to Firebase
            await db.ref("globalExamSettings").set(defaultExamSettings);
            cachedSettings = JSON.parse(JSON.stringify(defaultExamSettings));
        }
    } catch (err) {
        console.error("Failed to load exam settings:", err);
        cachedSettings = JSON.parse(JSON.stringify(defaultExamSettings));
    }

    return cachedSettings;
}

// ---- Render the table ----
async function renderTable() {
    document.getElementById("streamTitleDisplay").innerText = currentManageStream;
    const tbody    = document.getElementById("examTableBody");
    tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

    const settings = await getSettings();
    const subjects  = settings[currentManageStream];
    tbody.innerHTML  = "";

    for (const [subjectName, data] of Object.entries(subjects)) {
        const tr           = document.createElement("tr");
        const verifiedClass = data.verified ? "verified-yes" : "verified-no";
        const verifiedText  = data.verified ? "Verified (Open)" : "Locked (Wait)";

        tr.innerHTML = `
            <td><strong>${subjectName}</strong></td>
            <td><input type="number" id="time_${subjectName}" value="${data.duration}"></td>
            <td><input type="text"   id="pass_${subjectName}" value="${data.password}"></td>
            <td>
                <button class="toggle-switch ${verifiedClass}" onclick="toggleVerify('${subjectName}')">
                    ${verifiedText}
                </button>
            </td>
            <td>
                <button class="save-row-btn" onclick="saveSubject('${subjectName}')">Save Changes</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

// ---- Toggle verified status ----
window.toggleVerify = async function (subjectName) {
    const settings  = await getSettings();
    const current   = settings[currentManageStream][subjectName].verified;
    const newValue  = !current;

    settings[currentManageStream][subjectName].verified = newValue;

    try {
        await db.ref(`globalExamSettings/${currentManageStream}/${subjectName}/verified`).set(newValue);
        cachedSettings = settings;
        renderTable();
    } catch (err) {
        console.error("Toggle verify error:", err);
        alert("Failed to update. Check your connection.");
    }
};

// ---- Save a single subject row ----
window.saveSubject = async function (subjectName) {
    const settings = await getSettings();
    const newTime  = parseInt(document.getElementById(`time_${subjectName}`).value);
    const newPass  = document.getElementById(`pass_${subjectName}`).value;

    settings[currentManageStream][subjectName].duration = newTime;
    settings[currentManageStream][subjectName].password = newPass;

    try {
        await db.ref(`globalExamSettings/${currentManageStream}/${subjectName}`).update({
            duration: newTime,
            password: newPass
        });
        cachedSettings = settings;
        alert(`${subjectName} settings updated successfully!`);
    } catch (err) {
        console.error("Save subject error:", err);
        alert("Failed to save. Check your connection.");
    }
};

// ---- Switch stream button ----
document.getElementById("switchStreamBtn").addEventListener("click", () => {
    currentManageStream = (currentManageStream === "Natural Science") ? "Social Science" : "Natural Science";
    renderTable();
});

// ---- Init ----
document.addEventListener("DOMContentLoaded", renderTable);
