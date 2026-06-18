// Default settings if the admin hasn't set anything yet
const defaultExamSettings = {
    "Natural Science": {
        "English": { duration: 10, password: "eng", verified: true },
        "Mathematics": { duration: 10, password: "math", verified: true },
        "Physics": { duration: 10, password: "phy", verified: true },
        "Biology": { duration: 10, password: "bio", verified: true },
        "Scholastic aptitude test": { duration: 10, password: "sat", verified: true },
        "Chemistry": { duration: 10, password: "chem", verified: true }
    },
    "Social Science": {
        "English": { duration: 10, password: "eng", verified: true },
        "Mathematics": { duration: 10, password: "math", verified: true },
        "Geography": { duration: 10, password: "geo", verified: true },
        "History": { duration: 10, password: "his", verified: true },
        "Scholastic aptitude test": { duration: 10, password: "sat", verified: true },
        "Economics": { duration: 10, password: "eco", verified: true }
    }
};

let currentManageStream = "Natural Science";

// Load settings from local storage, or create them if they don't exist
function getSettings() {
    let settings = JSON.parse(localStorage.getItem("globalExamSettings"));
    if (!settings) {
        localStorage.setItem("globalExamSettings", JSON.stringify(defaultExamSettings));
        settings = defaultExamSettings;
    }
    return settings;
}

function renderTable() {
    document.getElementById("streamTitleDisplay").innerText = currentManageStream;
    const tbody = document.getElementById("examTableBody");
    tbody.innerHTML = "";

    const settings = getSettings();
    const subjects = settings[currentManageStream];

    for (const [subjectName, data] of Object.entries(subjects)) {
        const tr = document.createElement("tr");

        const verifiedClass = data.verified ? "verified-yes" : "verified-no";
        const verifiedText = data.verified ? "Verified (Open)" : "Locked (Wait)";

        tr.innerHTML = `
            <td><strong>${subjectName}</strong></td>
            <td><input type="number" id="time_${subjectName}" value="${data.duration}"></td>
            <td><input type="text" id="pass_${subjectName}" value="${data.password}"></td>
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

// Function to flip the Verified status
window.toggleVerify = function(subjectName) {
    let settings = getSettings();
    settings[currentManageStream][subjectName].verified = !settings[currentManageStream][subjectName].verified;
    localStorage.setItem("globalExamSettings", JSON.stringify(settings));
    renderTable(); // Re-draw to show color change
}

// Function to save the typed Time and Password
window.saveSubject = function(subjectName) {
    let settings = getSettings();
    const newTime = document.getElementById(`time_${subjectName}`).value;
    const newPass = document.getElementById(`pass_${subjectName}`).value;

    settings[currentManageStream][subjectName].duration = parseInt(newTime);
    settings[currentManageStream][subjectName].password = newPass;

    localStorage.setItem("globalExamSettings", JSON.stringify(settings));
    alert(`${subjectName} settings updated successfully!`);
}

// Switch stream button
document.getElementById("switchStreamBtn").addEventListener("click", () => {
    currentManageStream = (currentManageStream === "Natural Science") ? "Social Science" : "Natural Science";
    renderTable();
});

// Load the table when the page starts
document.addEventListener("DOMContentLoaded", renderTable);
