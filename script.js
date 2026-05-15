// ========================================
// FIREBASE IMPORTS
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ========================================
// FIREBASE CONFIG
// ========================================
const firebaseConfig = {

  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"

};


// ========================================
// INITIALIZE FIREBASE
// ========================================
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ========================================
// SIGN UP
// ========================================
const signupForm = document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {

      // Create User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Save User Data
      await addDoc(collection(db, "users"), {

        uid: user.uid,
        name: name,
        email: email

      });

      alert("Signup Successful!");

      window.location.href = "index.html";

    } catch (error) {

      alert(error.message);

    }

  });

}


// ========================================
// LOGIN
// ========================================
const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {

      await signInWithEmailAndPassword(auth, email, password);

      alert("Login Successful!");

      window.location.href = "index.html";

    } catch (error) {

      alert(error.message);

    }

  });

}


// ========================================
// LOGOUT
// ========================================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      await signOut(auth);

      alert("Logged Out Successfully!");

      window.location.href = "index.html";

    } catch (error) {

      alert(error.message);

    }

  });

}


// ========================================
// GET USERNAME FROM FIRESTORE
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

    console.error("Error Fetching Username:", error);

    return user.email;

  }

}


// ========================================
// AUTH STATE HANDLER
// ========================================
onAuthStateChanged(auth, async (user) => {

  const loginNav = document.getElementById("loginNav");

  const signupNav = document.getElementById("signupNav");

  const welcomeNav = document.getElementById("welcomeNav");

  const logoutNav = document.getElementById("logoutNav");

  const userNameSpan = document.getElementById("userName");

  const adminNav = document.getElementById("adminNav");


  const adminEmail = "learniokidslearning@gmail.com";


  if (
    loginNav &&
    signupNav &&
    welcomeNav &&
    logoutNav &&
    userNameSpan
  ) {

    if (user) {

      // Get Username
      const userName = await getUserName(user);

      // Hide Login & Signup
      loginNav.style.display = "none";
      signupNav.style.display = "none";

      // Show Welcome & Logout
      welcomeNav.style.display = "inline-block";
      logoutNav.style.display = "inline-block";

      // Show Username
      userNameSpan.textContent = userName;

      // Admin Panel
      if (adminNav) {

        if (user.email === adminEmail) {

          adminNav.style.display = "inline-block";

        } else {

          adminNav.style.display = "none";

        }

      }

    } else {

      // Show Login & Signup
      loginNav.style.display = "inline-block";
      signupNav.style.display = "inline-block";

      // Hide Welcome & Logout
      welcomeNav.style.display = "none";
      logoutNav.style.display = "none";

      // Clear Username
      userNameSpan.textContent = "";

      // Hide Admin
      if (adminNav) {

        adminNav.style.display = "none";

      }

    }

  }

});
