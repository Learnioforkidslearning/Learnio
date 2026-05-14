import { getFirestore, collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

async function loadScienceVideos() {

    const snapshot = await getDocs(collection(db, "science"));

    let html = "";

    snapshot.forEach((doc) => {
        const data = doc.data();

        html += `
            <div class="card">
                <h3>${data.title}</h3>
                <video width="300" controls>
                    <source src="${data.videoUrl}" type="video/mp4">
                </video>
            </div>
        `;
    });

    document.getElementById("contentArea").innerHTML = html;
}

loadScienceVideos();
