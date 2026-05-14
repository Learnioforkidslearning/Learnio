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

    // Fallback to email if name is not found
    return userName || user.email;
  } catch (error) {
    console.error("Error fetching user name:", error);
    return user.email;
  }
}

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

    // Get user's name from Firestore
    const userName = await getUserName(user);

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
onAuthStateChanged(auth, async (user) => {

  // ------------------------
  // Dashboard Page Support
  // ------------------------
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

  // ------------------------
  // Homepage Navigation Support
  // ------------------------
  const loginNav = document.getElementById("loginNav");
  const signupNav = document.getElementById("signupNav");
  const welcomeNav = document.getElementById("welcomeNav");
  const logoutNav = document.getElementById("logoutNav");
  const userNameSpan = document.getElementById("userName");
  const adminNav = document.getElementById("adminNav");

  // Admin email
  const adminEmail = "learniokidslearning@gmail.com";

  // Run only if these elements exist on index.html
  if (loginNav && signupNav && welcomeNav && logoutNav && userNameSpan) {

    if (user) {
      // Get user's name from Firestore
      const userName = await getUserName(user);

      // User is logged in
      loginNav.style.display = "none";
      signupNav.style.display = "none";
      welcomeNav.style.display = "inline-block";
      logoutNav.style.display = "inline-block";

      // Show user's name
      userNameSpan.textContent = userName;

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

      // Clear displayed name
      userNameSpan.textContent = "";

      // Hide Admin link
      if (adminNav) {
        adminNav.style.display = "none";
      }
    }
  }
});
