// ===========================================
// Learnio AI v2 UI
// Premium Interface
// ===========================================

document.addEventListener("DOMContentLoaded", () => {

const root = document.getElementById("learnio-ai");

if (!root) {
    console.error("Learnio AI container not found.");
    return;
}

root.innerHTML = `
<button class="ai-fab" id="aiFab">
    🤖
</button>

<div class="ai-window" id="aiWindow" style="display:none;">

    <div class="ai-header">

        <div class="ai-title">

            <div class="ai-avatar">
                🧠
            </div>

            <div>
                <h2>Learnio AI</h2>
                <p>Your Friendly Learning Buddy</p>
            </div>

        </div>

        <div class="ai-close" id="aiClose">
            ✕
        </div>

    </div>

    <!-- Premium Welcome -->

    <div class="ai-welcome" id="welcomeScreen">

        <div class="ai-particles">

            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>

        </div>

        <div class="ai-hero">

            <div class="hero-avatar">
                🤖
            </div>

            <div class="hero-badge">
                ✨ Learnio AI Premium
            </div>

            <h3>Hello, Future Genius! 👋</h3>

            <p>
                I'm your personal AI learning companion.
                Ask questions, discover lessons, practise quizzes,
                and soon I'll answer using Gemini AI.
            </p>

        </div>

        <div class="ai-grid">

            <div class="ai-card" data-question="Teach me Alphabet">

                <div class="icon">🔤</div>

                <h4>Alphabet</h4>

                <p>Learn letters and pronunciation</p>

            </div>

            <div class="ai-card" data-question="Help me with Math">

                <div class="icon">➕</div>

                <h4>Math</h4>

                <p>Solve fun maths questions</p>

            </div>

            <div class="ai-card" data-question="Tell me about Science">

                <div class="icon">🔬</div>

                <h4>Science</h4>

                <p>Explore amazing discoveries</p>

            </div>

            <div class="ai-card" data-question="Give me a Quiz">

                <div class="icon">🎯</div>

                <h4>Quiz</h4>

                <p>Challenge yourself</p>

            </div>

        </div>

        <div class="ai-suggestion-row">

            <button class="suggestion" data-question="Explain photosynthesis">
                🌿 Explain Photosynthesis
            </button>

            <button class="suggestion" data-question="Practice Multiplication">
                ✖ Practice Multiplication
            </button>

            <button class="suggestion" data-question="Tell me a Fun Fact">
                🚀 Fun Fact
            </button>

        </div>

    </div>

    <!-- Chat -->

    <div class="ai-chat" id="chatArea"></div>

    <div class="ai-typing" id="typing">

        <div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>

    </div>

    <div class="ai-input">

        <button class="ai-icon" id="voiceBtn" title="Voice Assistant (Coming Soon)">
            🎤
        </button>

        <button class="ai-icon" id="imageBtn" title="Image Recognition (Coming Soon)">
            🖼️
        </button>

        <input
            id="aiInput"
            placeholder="Ask me anything..."
        >

        <button class="ai-icon ai-send" id="sendBtn">
            ➤
        </button>

    </div>

</div>
`;

const fab = document.getElementById("aiFab");
const windowAI = document.getElementById("aiWindow");
const closeBtn = document.getElementById("aiClose");

fab.onclick = () => {
    windowAI.style.display = "flex";
};

closeBtn.onclick = () => {
    windowAI.style.display = "none";
};

const chat = document.getElementById("chatArea");
const welcome = document.getElementById("welcomeScreen");
const typing = document.getElementById("typing");
const input = document.getElementById("aiInput");

function addMessage(text, sender) {

    welcome.style.display = "none";
    chat.style.display = "block";

    const message = document.createElement("div");

    message.className = "message " + sender;

    message.innerHTML = `
        <div class="bubble">
            ${text}
        </div>
    `;

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;

}

function fakeReply(userText) {

    typing.style.display = "block";

    setTimeout(() => {

        typing.style.display = "none";

        addMessage(
            "Great question! Soon I'll answer using the Gemini AI model. For now, I'm still learning. 😊",
            "bot"
        );

    }, 1200);

}

document.getElementById("sendBtn").onclick = () => {

    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    input.value = "";

    fakeReply(text);

};

input.addEventListener("keypress", e => {

    if (e.key === "Enter") {

        document.getElementById("sendBtn").click();

    }

});

document.querySelectorAll(".ai-card").forEach(card => {

    card.onclick = () => {

        const q = card.dataset.question;

        addMessage(q, "user");

        fakeReply(q);

    };

});

document.querySelectorAll(".suggestion").forEach(btn => {

    btn.onclick = () => {

        const q = btn.dataset.question;

        addMessage(q, "user");

        fakeReply(q);

    };

});

document.getElementById("voiceBtn").onclick = () => {

    alert("🎤 Voice Assistant is coming in a future update!");

};

document.getElementById("imageBtn").onclick = () => {

    alert("🖼️ Homework Image Recognition is coming soon!");

};

});