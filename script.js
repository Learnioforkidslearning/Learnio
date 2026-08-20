// ==========================================
// FIREBASE BACKEND
//
// CHANGES IN THIS VERSION vs your original:
//
// 1. New signups now write to users/{uid} (setDoc with the uid as the
//    document ID) instead of addDoc() with a random ID. This is what
//    lets Firestore Security Rules (next file) cheaply check "is this
//    the user's own document?" — that check needs doc ID === uid.
//
// 2. New signups get role:"user" and plan:"free" by default, plus a
//    createdAt server timestamp.
//
// 3. getUserData() now tries the fast uid-keyed lookup first, and
//    falls back to your old where("uid","==",...) query for any
//    EXISTING accounts created before this change (so nobody's
//    account breaks — this is why the old query code is still here).
//
// 4. The admin nav check now reads role from Firestore instead of
//    only the hardcoded email. The hardcoded email is kept ONLY as a
//    bootstrap fallback for your one existing admin account, which
//    doesn't have a role field yet (see the note near ADMIN NAV
//    VISIBILITY below) — and only ever controls whether the Admin
//    *link* shows, never actual data access. Once you add
//    role:"admin" to that account's Firestore doc (Firebase Console →
//    Firestore → users → your account → add field), you can delete
//    the email fallback entirely. Real access control belongs in
//    Firestore Security Rules and in admin.html's own gate — not here.
// ==========================================

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
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyCHq7VSO1G4mgZlEOYCdGBNHtjPFSvNVsU",
    authDomain: "learnio-d0f2a.firebaseapp.com",
    projectId: "learnio-d0f2a",
    storageBucket: "learnio-d0f2a.firebasestorage.app",
    messagingSenderId: "213606684378",
    appId: "1:213606684378:web:ffe4c0762d007df3cdb7e3",
    measurementId: "G-T02E7YRSGF"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==========================================
// SIGNUP
// ==========================================

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

        // Doc ID is now the uid itself — required for the Security
        // Rules we're adding next, and for the fast lookup below.
        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,
            name: name,
            email: email,
            role: "user",
            plan: "free",
            createdAt: serverTimestamp()

        });

        alert("Signup Successful!");

        window.location.href = "index.html";

    } catch (error) {

        console.error("Signup Error:", error);

        alert(error.message);

    }

};


// ==========================================
// LOGIN
// ==========================================

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

        console.error("Login Error:", error);

        alert(error.message);

    }

};


// ==========================================
// LOGOUT
// ==========================================

window.logoutUser = async function () {

    try {

        await signOut(auth);

        alert("Logged Out Successfully!");

        window.location.href = "index.html";

    } catch (error) {

        console.error("Logout Error:", error);

        alert(error.message);

    }

};


// ==========================================
// GET USER DATA
//
// Tries the new uid-keyed doc first (users/{uid}). If that doesn't
// exist — meaning this is an account created before this update, via
// the old addDoc() with a random ID — falls back to the old
// where("uid","==",...) query so existing accounts keep working.
// Returns { name, role, plan } with sensible defaults if nothing is
// found at all.
// ==========================================

async function getUserData(user) {

    try {

        const directRef = doc(db, "users", user.uid);
        const directSnap = await getDoc(directRef);

        if (directSnap.exists()) {

            const data = directSnap.data();

            return {
                name: data.name || user.email,
                role: data.role || "user",
                plan: data.plan || "free"
            };

        }

        // Legacy fallback: pre-existing account from before this
        // change, whose doc ID is a random addDoc() ID, not the uid.
        const q = query(
            collection(db, "users"),
            where("uid", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {

            const data = querySnapshot.docs[0].data();

            return {
                name: data.name || user.email,
                role: data.role || "user",
                plan: data.plan || "free"
            };

        }

        return { name: user.email, role: "user", plan: "free" };

    } catch (error) {

        console.error("Get User Error:", error);

        return { name: user.email, role: "user", plan: "free" };

    }

}


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(auth, async (user) => {

    const loginNav = document.getElementById("loginNav");
    const signupNav = document.getElementById("signupNav");
    const welcomeNav = document.getElementById("welcomeNav");
    const logoutNav = document.getElementById("logoutNav");
    const userNameSpan = document.getElementById("userName");
    const adminNav = document.getElementById("adminNav");

    if (!loginNav || !signupNav || !welcomeNav || !logoutNav || !userNameSpan) {
        return;
    }

    if (user) {

        const userData = await getUserData(user);

        loginNav.style.display = "none";
        signupNav.style.display = "none";

        welcomeNav.style.display = "inline-block";
        logoutNav.style.display = "inline-block";

        userNameSpan.textContent = userData.name;


        // ADMIN NAV VISIBILITY ONLY — this is not the security
        // boundary. Real enforcement lives in Firestore Security
        // Rules and in admin.html's own auth+role check (next files).
        //
        // The `|| user.email === ...` fallback exists ONLY because
        // your one existing admin account predates the role field and
        // doesn't have role:"admin" in Firestore yet. Once you add
        // that field by hand in the Firebase Console, delete the
        // fallback below and keep just `userData.role === "admin"`.
        if (adminNav) {

            const isAdmin =
                userData.role === "admin" ||
                user.email === "learniokidslearning@gmail.com"; // TEMP bootstrap — remove after setting role:"admin" in Firestore

            adminNav.style.display = isAdmin ? "inline-block" : "none";

        }

    } else {

        loginNav.style.display = "inline-block";
        signupNav.style.display = "inline-block";

        welcomeNav.style.display = "none";
        logoutNav.style.display = "none";

        userNameSpan.textContent = "";

        if (adminNav) {

            adminNav.style.display = "none";

        }

    }

});