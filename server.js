// ============================================================
//  MOE EXAM PRACTICE PLATFORM — LOCAL NETWORK SERVER
//  Built for Wubshet Haymanot Asefa — Dilla City, Gede'o Zone
//  Run this on the ADMIN computer only
// ============================================================

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const os      = require('os');
const app     = express();

app.use(express.json());
app.use(express.static(__dirname)); // Serve all your HTML/CSS/JS files

const DB_FILE = path.join(__dirname, 'db.json');

// ── DATABASE HELPERS ─────────────────────────────────────────
function getDB() {
    if (!fs.existsSync(DB_FILE)) {
        const initial = {
            users: [],
            admin: {
                pagePassword: "1236",   // password to unlock admin pages
                loginPassword: "1234"   // password for admin login on index.html
            },
            examSettings: {
                "Natural Science": {
                    "English":                   { duration: 10, password: "eng",  verified: false },
                    "Mathematics":               { duration: 10, password: "math", verified: false },
                    "Physics":                   { duration: 10, password: "phy",  verified: false },
                    "Biology":                   { duration: 10, password: "bio",  verified: false },
                    "Scholastic aptitude test":  { duration: 10, password: "sat",  verified: false },
                    "Chemistry":                 { duration: 10, password: "chem", verified: false }
                },
                "Social Science": {
                    "English":                   { duration: 10, password: "eng",  verified: false },
                    "Mathematics":               { duration: 10, password: "math", verified: false },
                    "Geography":                 { duration: 10, password: "geo",  verified: false },
                    "History":                   { duration: 10, password: "his",  verified: false },
                    "Scholastic aptitude test":  { duration: 10, password: "sat",  verified: false },
                    "Economics":                 { duration: 10, password: "eco",  verified: false }
                }
            }
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
        console.log('  New database created: db.json');
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ── STUDENT LOGIN ─────────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = getDB();

    // Admin login check
    if (username === 'admin' && password === db.admin.loginPassword) {
        return res.json({ success: true, isAdmin: true });
    }

    const idx = db.users.findIndex(u => u.username === username && u.password === password);
    if (idx !== -1) {
        const now = new Date().toLocaleString('en-GB', {
            weekday: 'long', day: 'numeric', month: 'long',
            year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
        });
        db.users[idx].lastLogin    = db.users[idx].currentLogin || "First time access";
        db.users[idx].currentLogin = now;
        saveDB(db);
        return res.json({ success: true, isAdmin: false, user: db.users[idx] });
    }

    res.json({ success: false, message: 'Invalid username or password.' });
});

// ── GET ALL USERS (admin only) ────────────────────────────────
app.get('/api/users', (req, res) => {
    res.json(getDB().users);
});

// ── REGISTER A STUDENT ────────────────────────────────────────
app.post('/api/users', (req, res) => {
    const db      = getDB();
    const newUser = req.body;

    if (db.users.find(u => u.username === newUser.username)) {
        return res.json({ success: false, message: 'Student ID already exists.' });
    }

    db.users.push(newUser);
    saveDB(db);
    console.log(`  [+] Student registered: ${newUser.username} — ${newUser.fullName}`);
    res.json({ success: true });
});

// ── UPDATE A STUDENT (password change, etc.) ─────────────────
app.put('/api/users/:username', (req, res) => {
    const db  = getDB();
    const idx = db.users.findIndex(u => u.username === req.params.username);

    if (idx === -1) return res.json({ success: false, message: 'Student not found.' });

    db.users[idx] = { ...db.users[idx], ...req.body };
    saveDB(db);
    console.log(`  [~] Student updated: ${req.params.username}`);
    res.json({ success: true, user: db.users[idx] });
});

// ── DELETE A STUDENT ──────────────────────────────────────────
app.delete('/api/users/:username', (req, res) => {
    const db = getDB();
    const before = db.users.length;
    db.users = db.users.filter(u => u.username !== req.params.username);
    saveDB(db);
    console.log(`  [-] Student deleted: ${req.params.username}`);
    res.json({ success: before !== db.users.length });
});

// ── GET EXAM SETTINGS ─────────────────────────────────────────
app.get('/api/settings', (req, res) => {
    res.json(getDB().examSettings);
});

// ── SAVE EXAM SETTINGS ────────────────────────────────────────
app.put('/api/settings', (req, res) => {
    const db = getDB();
    db.examSettings = req.body;
    saveDB(db);
    res.json({ success: true });
});

// ── VERIFY ADMIN PAGE PASSWORD ───────────────────────────────
app.post('/api/admin/verify', (req, res) => {
    const db = getDB();
    res.json({ success: req.body.password === db.admin.pagePassword });
});

// ── CHANGE ADMIN PAGE PASSWORD ───────────────────────────────
app.put('/api/admin/password', (req, res) => {
    const db = getDB();
    const { oldPassword, newPassword } = req.body;

    if (oldPassword !== db.admin.pagePassword) {
        return res.json({ success: false, message: 'Current password incorrect!' });
    }
    if (!newPassword || newPassword.length < 4) {
        return res.json({ success: false, message: 'New password must be at least 4 characters!' });
    }

    db.admin.pagePassword = newPassword;
    saveDB(db);
    console.log('  [*] Admin password changed.');
    res.json({ success: true });
});

// ── START SERVER ──────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    // Find local IP address
    let localIP = 'localhost';
    const nets  = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                localIP = net.address;
                break;
            }
        }
    }

    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║    MOE EXAM PRACTICE PLATFORM — SERVER RUNNING   ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║  This computer:   http://localhost:${PORT}           ║`);
    console.log(`║  Other computers: http://${localIP}:${PORT}     ║`);
    console.log('╠══════════════════════════════════════════════════╣');
    console.log('║  Tell students to open their browser and type:   ║');
    console.log(`║  http://${localIP}:${PORT}                   ║`);
    console.log('╚══════════════════════════════════════════════════╝\n');
    console.log('  Server log (activity will appear below):');
    console.log('  ─────────────────────────────────────────');
});
