// ========================================
// FIREBASE IMPORTS
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
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
  apiKey: "AIzaSyD6neQSX3wAQug4zZAK8WdmfsUxQ6r_hcQ",
  authDomain: "learniokidslearning-v3.firebaseapp.com",
  projectId: "learniokidslearning-v3",
  storageBucket: "learniokidslearning-v3.firebasestorage.app",
  messagingSenderId: "316801934015",
  appId: "1:316801934015:web:a52c121585c9240618dc0a",
  measurementId: "G-KR9L5M3VWK"
};
// ========================================
// INITIALIZE FIREBASE
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ========================================
// SIGNUP FUNCTION
// ========================================
window.signupUser = async function (event) {
  event.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    // Create account with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Save additional information in Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });

    alert("Account created successfully!");
    window.location.href = "login.html";

  } catch (error) {
    alert("Signup Error: " + error.message);
    console.error(error);
  }
};

// ========================================
// LOGIN FUNCTION
// ========================================
window.loginUser = async function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    // Login using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Read all users from Firestore
    const usersSnapshot = await getDocs(collection(db, "users"));

    // Default name
    let userName = "User";

    // Find the logged-in user's name
    usersSnapshot.forEach((doc) => {
      const data = doc.data();

      if (data.uid === user.uid) {
        userName = data.name || "User";
      }
    });

    // Show personalized popup
    alert(`Welcome, ${userName}! Login successful.`);

    // Redirect to homepage
    window.location.href = "index.html";

  } catch (error) {
    alert("Login Error: " + error.message);
    console.error(error);
  }
};

// ========================================
// LOGOUT FUNCTION
// ========================================
window.logoutUser = async function () {
  try {
    await signOut(auth);
    alert("Logged out successfully.");
    window.location.href = "index.html";
  } catch (error) {
    alert("Logout Error: " + error.message);
    console.error(error);
  }
};

// ========================================
// AUTH STATE HANDLER
// ========================================
onAuthStateChanged(auth, (user) => {

  // ------------------------
  // Dashboard Page Support
  // ------------------------
  const userInfo = document.getElementById("userInfo");

  if (userInfo) {
    if (user) {
      userInfo.textContent = `Welcome, ${user.email}`;
    } else {
      window.location.href = "login.html";
      return;
    }
  }

  // ------------------------
  // Homepage Navigation Support
  // ------------------------
  const loginNav = document.getElementById("loginNav");
  const signupNav = document.getElementById("signupNav");
  const welcomeNav = document.getElementById("welcomeNav");
  const logoutNav = document.getElementById("logoutNav");
  const userEmail = document.getElementById("userEmail");
  const adminNav = document.getElementById("adminNav");

  // Your admin email
  const adminEmail = "learniokidslearning@gmail.com";

  // Run only if these elements exist on index.html
  if (loginNav && signupNav && welcomeNav && logoutNav && userEmail) {

    if (user) {
      // User is logged in
      loginNav.style.display = "none";
      signupNav.style.display = "none";
      welcomeNav.style.display = "inline-block";
      logoutNav.style.display = "inline-block";

      // Show user's email
      userEmail.textContent = user.email;

      // Show Admin link only to the admin account
      if (adminNav) {
        if (user.email === adminEmail) {
          adminNav.style.display = "inline-block";
        } else {
          adminNav.style.display = "none";
        }
      }

    } else {
      // User is logged out
      loginNav.style.display = "inline-block";
      signupNav.style.display = "inline-block";
      welcomeNav.style.display = "none";
      logoutNav.style.display = "none";

      // Clear email
      userEmail.textContent = "";

      // Hide Admin link
      if (adminNav) {
        adminNav.style.display = "none";
      }
    }
  }
});
