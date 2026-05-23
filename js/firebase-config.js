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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
