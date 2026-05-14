// Firebase Storage + Firestore imports
import { getStorage, ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

import { getFirestore, addDoc, collection } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize services
const storage = getStorage();
const db = getFirestore();


// 🚀 UPLOAD FUNCTION
window.uploadVideo = async function () {

    const file = document.getElementById("videoFile").files[0];
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;

    // ❌ Validation
    if (!file || !title) {
        alert("⚠️ Please fill all fields");
        return;
    }

    try {

        // 📁 Step 1: Create storage path
        const storageRef = ref(storage, `${category}/${file.name}`);

        // ⬆️ Step 2: Upload file to Firebase Storage
        await uploadBytes(storageRef, file);

        // 🔗 Step 3: Get download URL
        const videoURL = await getDownloadURL(storageRef);

        // 🗂 Step 4: Save data in Firestore
        await addDoc(collection(db, category), {
            title: title,
            videoUrl: videoURL,
            createdAt: new Date()
        });

        alert("✅ Upload Successful!");

        // Clear inputs
        document.getElementById("title").value = "";
        document.getElementById("videoFile").value = "";

    } catch (error) {
        console.error(error);
        alert("❌ Upload Failed");
    }
};
