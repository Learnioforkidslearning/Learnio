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

const auth = getAuth(app);

const db = getFirestore(app);


// ========================================
// SIGNUP FUNCTION
// ========================================
window.signupUser = async function (event) {

  event.preventDefault();

  const name = document.getElementById("signupName").value;

  const email = document.getElementById("signupEmail").value;

  const password = document.getElementById("signupPassword").value;

  try {

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    // Save user in Firestore
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

};


// ========================================
// LOGIN FUNCTION
// ========================================
window.loginUser = async function (event) {

  event.preventDefault();

  const email = document.getElementById("loginEmail").value;

  const password = document.getElementById("loginPassword").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert("Login Successful!");

    window.location.href = "index.html";

  } catch (error) {

    alert(error.message);

  }

};


// ========================================
// LOGOUT FUNCTION
// ========================================
window.logoutUser = async function () {

  try {

    await signOut(auth);

    alert("Logged Out Successfully!");

    window.location.href = "index.html";

  } catch (error) {

    alert(error.message);

  }

};


// ========================================
// GET USER NAME
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

    console.error(error);

    return user.email;

  }

}


// ========================================
// AUTH STATE CHANGES
// ========================================
onAuthStateChanged(auth, async (user) => {

  const loginNav = document.getElementById("loginNav");

  const signupNav = document.getElementById("signupNav");

  const welcomeNav = document.getElementById("welcomeNav");

  const logoutNav = document.getElementById("logoutNav");

  const userNameSpan = document.getElementById("userName");

  const adminNav = document.getElementById("adminNav");


  // Run only if navbar exists
  if (
    loginNav &&
    signupNav &&
    welcomeNav &&
    logoutNav &&
    userNameSpan
  ) {

    if (user) {

      // Fetch username
      const userName = await getUserName(user);

      // Hide Login + Signup
      loginNav.style.display = "none";
      signupNav.style.display = "none";

      // Show Welcome + Logout
      welcomeNav.style.display = "inline-block";
      logoutNav.style.display = "inline-block";

      // Set username
      userNameSpan.textContent = userName;

      // Admin Panel
      if (adminNav) {

        if (user.email === "learniokidslearning@gmail.com") {

          adminNav.style.display = "inline-block";

        } else {

          adminNav.style.display = "none";

        }

      }

    } else {

      // Show Login + Signup
      loginNav.style.display = "inline-block";
      signupNav.style.display = "inline-block";

      // Hide Welcome + Logout
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
