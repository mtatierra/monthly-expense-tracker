// js/firebaseInit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Replace with your actual config from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyCH0nxsBm3zbWHaWlFmXLAG0ZPUvWvF5dE",
  authDomain: "monthly-expense-tracker-661d5.firebaseapp.com",
  projectId: "monthly-expense-tracker-661d5",
  storageBucket: "monthly-expense-tracker-661d5.firebasestorage.app",
  messagingSenderId: "984156788505",
  appId: "1:984156788505:web:be1223e046d4d358775788",
  measurementId: "G-14HF82JJ7F",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
