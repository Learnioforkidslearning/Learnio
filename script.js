// ========================================
// FIREBASE IMPORTS
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// ========================================
// FIREBASE CONFIGURATION
// ========================================
const firebaseConfig = {
  apiKey: "AIzaSyCHq7VSO1G4mgZlEOYCdGBNHtjPFSvNVsU",
  authDomain: "learnio-d0f2a.firebaseapp.com",
  projectId: "learnio-d0f2a",
  storageBucket: "learnio-d0f2a.firebasestorage.app",
  messagingSenderId: "213606684378",
  appId: "1:213606684378:web:ffe4c0762d007df3cdb7e3",
  measurementId: "G-T02E7YRSGF"
};

// ========================================
// INITIALIZE FIREBASE
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ========================================
// HELPER FUNCTION: GET USER NAME
// ========================================
async function getUserName(user) {
  try {

    const q = query(
      collection(db, "users"),
      where("uid", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().name;
    }

    return user.email;

  } catch (error) {
    console.error("Error fetching username:", error);
    return user.email;
});
