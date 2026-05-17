// MANAGE EXAMS — settings saved to server database via API
// api.js must be loaded before this script

const defaultExamSettings = {
    "Natural Science": {
        "English":                  { duration: 10, password: "eng",  verified: false },
        "Mathematics":              { duration: 10, password: "math", verified: false },
        "Physics":                  { duration: 10, password: "phy",  verified: false },
        "Biology":                  { duration: 10, password: "bio",  verified: false },
        "Scholastic aptitude test": { duration: 10, password: "sat",  verified: false },
        "Chemistry":                { duration: 10, password: "chem", verified: false }
    },
    "Social Science": {
        "English":                  { duration: 10, password: "eng",  verified: false },
        "Mathematics":              { duration: 10, password: "math", verified: false },
        "Geography":                { duration: 10, password: "geo",  verified: false },
        "History":                  { duration: 10, password: "his",  verified: false },
        "Scholastic aptitude test": { duration: 10, password: "sat",  verified: false },
        "Economics":                { duration: 10, password: "eco",  verified: false }
    }
};

let currentManageStream = "Natural Science";
let cachedSettings      = null; // local cache to avoid repeated server calls

// Load settings from server
async function getSettings() {
    if (cachedSettings) return cachedSettings;
    const serverSettings = await API.getSettings();
    cachedSettings = serverSettings || defaultExamSettings;
    return cachedSettings;
}

// Save settings to server
async function persistSettings(settings) {
    cachedSettings = settings;
    await API.saveSettings(settings);
}

async function renderTable() {
    document.getElementById("streamTitleDisplay").innerText = currentManageStream;
    const tbody    = document.getElementById("examTableBody");
    tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;color:#aaa;'>Loading...</td></tr>";

    const settings = await getSettings();
    const subjects  = settings[currentManageStream];
    tbody.innerHTML = "";

    for (const [subjectName, data] of Object.entries(subjects)) {
        const tr            = document.createElement("tr");
        const verifiedClass = data.verified ? "verified-yes" : "verified-no";
        const verifiedText  = data.verified ? "Verified (Open)" : "Locked (Wait)";

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

// Toggle verified status
window.toggleVerify = async function (subjectName) {
    const settings = await getSettings();
    settings[currentManageStream][subjectName].verified =
        !settings[currentManageStream][subjectName].verified;
    await persistSettings(settings);
    renderTable();
};

// Save one subject row
window.saveSubject = async function (subjectName) {
    const settings = await getSettings();
    const newTime  = document.getElementById(`time_${subjectName}`).value;
    const newPass  = document.getElementById(`pass_${subjectName}`).value;

    settings[currentManageStream][subjectName].duration = parseInt(newTime);
    settings[currentManageStream][subjectName].password  = newPass;

    await persistSettings(settings);
    alert(`${subjectName} settings saved to server successfully!`);
};

// Switch stream
document.getElementById("switchStreamBtn").addEventListener("click", () => {
    currentManageStream = (currentManageStream === "Natural Science")
        ? "Social Science"
        : "Natural Science";
    cachedSettings = null; // clear cache on stream switch
    renderTable();
});

// Load on page start
document.addEventListener("DOMContentLoaded", renderTable);
