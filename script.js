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
// ==========================================
// THEME.JS
// - Auto color-changing palette (rotates every 45s)
// - Auto-creates the floating background shapes + gradient layers
//   if they aren't already in the HTML, so the 3D animation shows up
//   even if index.html wasn't hand-edited.
// - Whole-layer mouse/scroll parallax + hero card pointer tilt.
//
// Drop this in with: <script src="theme.js"></script>
// right before </body>. Nothing else needs to change in index.html.
// ==========================================

(() => {

    // ---------- 1. Palettes ----------
    // Each palette is a handful of related colors (not a rainbow).
    // bg: the 4 gradient stops for the page background.
    // ink/muted/accent/accent2: the CSS custom properties everything
    // else (text, buttons, shapes) reads from.
    const PALETTES = [
        {
            name: 'ocean',
            bg: ['#ECFEFF', '#BAE6FD', '#C7D2FE', '#0E7490'],
            ink: '#123847', muted: '#3B6B75',
            accent: '#0D9488', accent2: '#8B7FE8'
        },
        {
            name: 'sunset',
            bg: ['#FFF7ED', '#FDBA74', '#FB7185', '#6D28D9'],
            ink: '#4C1D24', muted: '#9A5B4A',
            accent: '#E11D48', accent2: '#7C3AED'
        },
        {
            name: 'candy',
            bg: ['#FDF4FF', '#F0ABFC', '#C084FC', '#A21CAF'],
            ink: '#4A044E', muted: '#86198F',
            accent: '#C026D3', accent2: '#7C3AED'
        },
        {
            name: 'meadow',
            bg: ['#F0FDF4', '#86EFAC', '#5EEAD4', '#0D9488'],
            ink: '#064E3B', muted: '#0F766E',
            accent: '#059669', accent2: '#14B8A6'
        }
    ];

    const ROTATE_MS = 45000; // 45s — inside your requested 30s–60s window

    function gradientCSS(bg){
        return `linear-gradient(135deg, ${bg[0]}, ${bg[1]}, ${bg[2]}, ${bg[3]})`;
    }

    // ---------- 2. Make sure the DOM has what we need ----------
    let floatLayer = document.querySelector('.floating-3d');

    if (!floatLayer) {
        floatLayer = document.createElement('div');
        floatLayer.className = 'floating-3d';
        document.body.insertBefore(floatLayer, document.body.firstChild);
    }

    // Background crossfade layers (siblings placed right before floatLayer)
    let bgA = document.querySelector('.bg-layer.bg-a');
    let bgB = document.querySelector('.bg-layer.bg-b');

    if (!bgA) {
        bgA = document.createElement('div');
        bgA.className = 'bg-layer bg-a is-active';
        document.body.insertBefore(bgA, floatLayer);
    }
    if (!bgB) {
        bgB = document.createElement('div');
        bgB.className = 'bg-layer bg-b';
        document.body.insertBefore(bgB, floatLayer);
    }

    // Floating shapes — only inject if the container is empty, so we
    // never duplicate shapes you've already hand-placed in index.html.
    if (floatLayer.children.length === 0) {

        const shapeSpecs = [
            ['bubble', 'bubble1'], ['bubble', 'bubble2'], ['bubble', 'bubble3'],
            ['bubble', 'bubble4'], ['bubble', 'bubble5'],
            ['cube', 'cube1'], ['cube', 'cube2'],
            ['pyramid', 'pyramid1'], ['pyramid', 'pyramid2'],
            ['torus', 'torus1'], ['torus', 'torus2'],
            ['blob', 'blob1'], ['blob', 'blob2']
        ];

        shapeSpecs.forEach(([family, variant]) => {
            const el = document.createElement('div');
            el.className = `${family} ${variant}`;
            floatLayer.appendChild(el);
        });
    }

    // ---------- 3. Apply a palette ----------
    function applyPalette(p){

        const root = document.documentElement.style;
        root.setProperty('--c-ink', p.ink);
        root.setProperty('--c-muted', p.muted);
        root.setProperty('--c-accent', p.accent);
        root.setProperty('--c-accent2', p.accent2);

        const activeLayer   = bgA.classList.contains('is-active') ? bgA : bgB;
        const incomingLayer = activeLayer === bgA ? bgB : bgA;

        incomingLayer.style.backgroundImage = gradientCSS(p.bg);
        // paint it while invisible, then crossfade on the next frame
        requestAnimationFrame(() => {
            incomingLayer.classList.add('is-active');
            activeLayer.classList.remove('is-active');
        });
    }

    let paletteIndex = 0;
    applyPalette(PALETTES[paletteIndex]);

    setInterval(() => {
        paletteIndex = (paletteIndex + 1) % PALETTES.length;
        applyPalette(PALETTES[paletteIndex]);
    }, ROTATE_MS);

    // ---------- 4. Whole-layer parallax (mouse + scroll) ----------
    let targetMX = 0, targetMY = 0, targetSY = 0;
    let mx = 0, my = 0, sy = 0;

    window.addEventListener('mousemove', (e) => {
        targetMX = (e.clientX / window.innerWidth  - 0.5) * 2;
        targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        targetSY = Math.max(-1, Math.min(1, window.scrollY / 900));
    }, { passive: true });

    function tick(){
        mx += (targetMX - mx) * 0.04;
        my += (targetMY - my) * 0.04;
        sy += (targetSY - sy) * 0.06;

        floatLayer.style.transform =
            `translate3d(${(mx * 24).toFixed(1)}px, ${(sy * -34).toFixed(1)}px, 0)`;

        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // ---------- 5. Hero card pointer tilt ----------
    function setupHeroTilt(){

        const heroCard = document.querySelector('.hero-3d-card');
        if (!heroCard || heroCard.dataset.tiltWired) return;
        heroCard.dataset.tiltWired = 'true';

        heroCard.addEventListener('mousemove', (e) => {

            const rect = heroCard.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top)  / rect.height;

            const maxTilt = 10;
            const tiltY = (px - 0.5) * maxTilt * 2;
            const tiltX = (0.5 - py) * maxTilt * 2;

            heroCard.style.setProperty('--tiltX', `${tiltX.toFixed(2)}deg`);
            heroCard.style.setProperty('--tiltY', `${tiltY.toFixed(2)}deg`);
        });

        heroCard.addEventListener('mouseleave', () => {
            heroCard.style.setProperty('--tiltX', '4deg');
            heroCard.style.setProperty('--tiltY', '-4deg');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupHeroTilt);
    } else {
        setupHeroTilt();
    }

})();