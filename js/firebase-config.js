// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);