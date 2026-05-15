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
// HELPER FUNCTION: GET USER NAME FROM FIRESTORE
// ========================================
async function getUserName(user) {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    let userName = "";

    usersSnapshot.forEach((doc) => {
      const data = doc.data();

      if (data.uid === user.uid) {
        userName = data.name || "";
      }
    });

    // If name is not found, use email as fallback
    return userName || user.email;
  } catch (error) {
    console.error("Error fetching user name:", error);
    return user.email;
  }
}

// ========================================
// SIGNUP FUNCTION
// Saves:
// - Name
// - Email
// - Gender
// - Age
// - Date of Birth
// - Country
// ========================================
window.signupUser = async function (event) {
  event.preventDefault();

  // Basic fields
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  // Additional fields
  const dob = document.getElementById("signupDOB").value;
  const country = document.getElementById("signupCountry").value;

  // Selected gender
  const genderInput = document.querySelector(
    'input[name="gender"]:checked'
  );
  const gender = genderInput ? genderInput.value : "";

  try {
    // Create account in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Save all user information in Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: name,
      email: email,
      gender: gender,
      dateOfBirth: dob,
      country: country,
      createdAt: new Date().toISOString()
    });

    // Success message
    alert(`Account created successfully! Welcome, ${name}.`);

    // Redirect to login page
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

    // Get user's name from Firestore
    const userName = await getUserName(user);

    // Personalized welcome popup
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
// Handles:
// - Dashboard welcome text
// - Homepage navigation
// - Admin visibility
// ========================================
onAuthStateChanged(auth, async (user) => {

  // ------------------------------------
  // Dashboard Page Support
  // ------------------------------------
  const userInfo = document.getElementById("userInfo");

  if (userInfo) {
    if (user) {
      const userName = await getUserName(user);
      userInfo.textContent = `Welcome, ${userName}`;
    } else {
      window.location.href = "login.html";
      return;
    }
  }

  // ------------------------------------
  // Homepage Navigation Support
  // ------------------------------------
  const loginNav = document.getElementById("loginNav");
  const signupNav = document.getElementById("signupNav");
  const welcomeNav = document.getElementById("welcomeNav");
  const logoutNav = document.getElementById("logoutNav");
  const userNameSpan = document.getElementById("userName");
  const adminNav = document.getElementById("adminNav");

  // Your admin email
  const adminEmail = "learniokidslearning@gmail.com";

  // Only run if navigation elements exist
  if (
    loginNav &&
    signupNav &&
    welcomeNav &&
    logoutNav &&
    userNameSpan
  ) {
    if (user) {
      // Get user's name
      const userName = await getUserName(user);

      // Hide Login and Sign Up
      loginNav.style.display = "none";
      signupNav.style.display = "none";

      // Show Welcome and Logout
      welcomeNav.style.display = "inline-block";
      logoutNav.style.display = "inline-block";

      // Show user's name
      userNameSpan.textContent = userName;

      // Show Admin only to admin account
      if (adminNav) {
        if (user.email === adminEmail) {
          adminNav.style.display = "inline-block";
        } else {
          adminNav.style.display = "none";
        }
      }

    } else {
      // Show Login and Sign Up
      loginNav.style.display = "inline-block";
      signupNav.style.display = "inline-block";

      // Hide Welcome and Logout
      welcomeNav.style.display = "none";
      logoutNav.style.display = "none";

      // Clear username
      userNameSpan.textContent = "";

      // Hide Admin
      if (adminNav) {
        adminNav.style.display = "none";
      }
    }
  }
});

// ========================================
// 3D MOUSE PARALLAX EFFECT
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(
    ".hero-3d-card, .card, .plan"
  );

  elements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert mouse position to rotation
      const rotateY = ((x / rect.width) - 0.5) * 12;
      const rotateX = ((0.5 - y / rect.height)) * 12;

      element.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        scale(1.02)
      `;
    });

    element.addEventListener("mouseleave", () => {
      // Reset transform
      if (element.classList.contains("hero-3d-card")) {
        element.style.transform = "rotateX(4deg) rotateY(-4deg)";
      } else {
        element.style.transform = "";
      }
    });
  });
});
