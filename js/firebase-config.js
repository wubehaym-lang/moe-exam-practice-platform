// ============================================================
//  FIREBASE CONFIGURATION — moe-exam-platform
//  Include this script FIRST on every HTML page, before all
//  other JS files.
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyB04dUF4ULHTlBobhU5Ms4NYB2cANwqrhA",
  authDomain: "moe-exam-platform.firebaseapp.com",
  databaseURL: "https://moe-exam-platform-default-rtdb.firebaseio.com",
  projectId: "moe-exam-platform",
  storageBucket: "moe-exam-platform.firebasestorage.app",
  messagingSenderId: "474198384795",
  appId: "1:474198384795:web:30dd75a5e8e37a5c1ee63e",
  measurementId: "G-61Y05CXE3T"
};

// Load Firebase SDKs (compat version — works with plain HTML/JS, no npm needed)
// These are loaded via <script> tags in each HTML file. This file just holds config.

firebase.initializeApp(firebaseConfig);

// Shared database reference used by all other scripts
const db = firebase.database();

console.log("✅ Firebase connected to moe-exam-platform");
