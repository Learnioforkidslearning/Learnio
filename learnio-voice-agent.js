/*
 * Learnio Hindi Voice Agent  (drop-in widget)
 * Add before </body> on every page:
 *   <script src="learnio-voice-agent.js"></script>
 *
 * Works in Chrome / Edge / Android Chrome (Web Speech API, hi-IN).
 * Optional smarter brain: set before loading this script
 *   window.LEARNIO_AGENT_ENDPOINT = "https://your-server/agent";
 * The endpoint receives {message, history} and returns {reply, action?}
 * where action is e.g. {"go":"math.html"} or {"scroll":"#pricing"}.
 */
(function () {
  "use strict";

  /* ---------- Knowledge about the site ---------- */
  const PAGES = {
    alphabet: "alphabet.html", math: "math.html", science: "science.html",
    drawing: "drawing.html", games: "fun/index.html",
    login: "login.html", signup: "signup.html"
  };

  const has = (t, words) => words.some(w => t.includes(w));

  const TOPICS = [
    { id: "alphabet", kw: ["अल्फाबेट", "वर्णमाला", "अक्षर", "फोनिक्स", "alphabet", "phonics", "letters", "abc"],
      say: "अल्फाबेट और फोनिक्स कोर्स में बच्चे रंगीन एनिमेशन के साथ अक्षर, उनकी आवाज़ें और शब्द सीखते हैं। यह हमारा सबसे लोकप्रिय कोर्स है।", go: "alphabet" },
    { id: "math", kw: ["गणित", "मैथ", "गिनती", "जोड़", "घटाव", "math", "counting", "numbers"],
      say: "नंबर और मैथ सेक्शन में गिनती, जोड़, घटाव और मज़ेदार गणित के खेल हैं।", go: "math" },
    { id: "science", kw: ["साइंस", "विज्ञान", "जानवर", "प्रकृति", "ग्रह", "मौसम", "science", "animals", "nature"],
      say: "साइंस और नेचर में बच्चे जानवर, ग्रह, मौसम और आसान प्रयोगों के बारे में सीखते हैं।", go: "science" },
    { id: "drawing", kw: ["ड्रॉइंग", "ड्राइंग", "चित्र", "पेंटिंग", "रंग भर", "drawing", "painting", "art"],
      say: "ड्रॉइंग और क्रिएटिविटी सेक्शन में बच्चे इंटरैक्टिव टूल्स से चित्र बना सकते हैं और रंग भर सकते हैं।", go: "drawing" },
    { id: "games", kw: ["गेम", "खेल", "बैलून", "फ्रूट", "मेमोरी", "game", "games", "fun", "balloon", "fruit", "memory"],
      say: "फन एक्टिविटीज़ में बैलून पॉप, फ्रूट कैच, हैंड कनेक्ट और मेमोरी चैलेंज जैसे खेल हैं, जो ध्यान और सोचने की क्षमता बढ़ाते हैं।", go: "games" }
  ];

  const PLAN_TEXT =
    "हमारे चार प्लान हैं। फ्री प्लान शून्य रुपये महीना, जिसमें पाँच मुफ़्त लेसन हैं। " +
    "मंथली प्लान निन्यानवे रुपये महीना, जिसमें अनलिमिटेड लेसन और पेरेंट डैशबोर्ड है। " +
    "छह महीने का प्लान चार सौ निन्यानवे रुपये का है। और सालाना प्लान नौ सौ निन्यानवे रुपये का, जिसमें सब कुछ शामिल है।";

  const INTENTS = [
    { name: "bye", kw: ["अलविदा", "बाय", "धन्यवाद", "शुक्रिया", "bye", "thanks", "thank you"],
      reply: () => "आपका धन्यवाद! बच्चों को सीखने में मज़ा आए। जब चाहें मुझे फिर बुला लीजिए।" },
    { name: "greet", kw: ["नमस्ते", "हेलो", "हैलो", "हाय", "hello", "hi "],
      reply: () => "नमस्ते! मैं लर्नियो की सहायक हूँ। आप कोर्स, प्लान की कीमत, साइन अप या किसी भी चीज़ के बारे में पूछ सकते हैं।" },
    { name: "free", kw: ["फ्री", "मुफ्त", "मुफ़्त", "free"],
      reply: () => "फ्री प्लान बिल्कुल मुफ़्त है। इसमें पाँच लेसन, बेसिक एक्टिविटीज़, कम्युनिटी एक्सेस और कुछ वीडियो मिलते हैं। शुरू करने के लिए साइन अप कर लीजिए।" },
    { name: "monthly", kw: ["मंथली", "monthly", "महीने का", "एक महीने", "99", "निन्यानवे"],
      reply: () => "मंथली प्लान निन्यानवे रुपये महीना है। इसमें अनलिमिटेड लेसन, प्रीमियम वीडियो, ड्रॉइंग एक्टिविटीज़ और पेरेंट डैशबोर्ड मिलता है।" },
    { name: "sixmonth", kw: ["छह महीने", "6 महीने", "6 month", "six month", "499", "चार सौ"],
      reply: () => "छह महीने का प्लान चार सौ निन्यानवे रुपये का है। इसमें सभी प्रीमियम फीचर, खास एनिमेशन, वर्कशीट डाउनलोड और प्राथमिकता सहायता मिलती है।" },
    { name: "yearly", kw: ["सालाना", "साल का", "yearly", "annual", "year", "999", "नौ सौ"],
      reply: () => "सालाना प्लान नौ सौ निन्यानवे रुपये का है। इसमें सब कुछ शामिल है: अनलिमिटेड एक्सेस, प्रीमियम लर्निंग पैक और बच्चे की प्रगति की ट्रैकिंग।", go: "#pricing" },
    { name: "pricing", kw: ["कीमत", "दाम", "पैसे", "प्लान", "सब्सक्रिप्शन", "कितना", "रुपये", "price", "plan", "pricing", "subscription", "cost", "premium", "प्रीमियम"],
      reply: () => PLAN_TEXT, go: "#pricing" },
    { name: "signup", kw: ["साइन अप", "साइनअप", "रजिस्टर", "खाता बना", "sign up", "signup", "register"],
      reply: () => "ठीक है, मैं आपको साइन अप पेज पर ले जा रही हूँ।", go: "signup" },
    { name: "login", kw: ["लॉगिन", "लॉग इन", "login", "log in", "sign in"],
      reply: () => "ठीक है, मैं आपको लॉगिन पेज पर ले जा रही हूँ।", go: "login" },
    { name: "parents", kw: ["पेरेंट", "अभिभावक", "माता", "टीचर", "शिक्षक", "सुरक्षित", "विज्ञापन", "रिपोर्ट", "वर्कशीट", "प्रगति",
                           "parent", "teacher", "safe", "ads", "report", "worksheet", "progress"],
      reply: () => "लर्नियो पूरी तरह सुरक्षित और विज्ञापन-मुक्त है, यहाँ कोई अजनबी नहीं है। माता-पिता को हर हफ़्ते बच्चे की प्रगति की रिपोर्ट मिलती है, और शिक्षक वर्कशीट और लेसन प्लान प्रिंट करके क्लासरूम में इस्तेमाल कर सकते हैं।", go: "#parents" },
    { name: "contact", kw: ["संपर्क", "सम्पर्क", "सहायता", "मदद", "शिकायत", "कॉन्टैक्ट", "contact", "support", "help", "complaint"],
      reply: () => "आप हमसे वेबसाइट के संपर्क फ़ॉर्म से जुड़ सकते हैं। मैं आपको वहाँ ले चलती हूँ, बस अपना संदेश भरकर भेज दीजिए।", go: "#contact" },
    { name: "courses", kw: ["कोर्स", "कौन सी चीज़", "क्या सीख", "सिखा", "courses", "course", "learn", "lessons"],
      reply: () => "हमारे पाँच सेक्शन हैं: अल्फाबेट और फोनिक्स, नंबर और मैथ, साइंस और नेचर, ड्रॉइंग और क्रिएटिविटी, और फन गेम्स। आप किसके बारे में जानना चाहेंगे?", go: "#courses" }
  ];

  const NAV_VERBS = ["खोल", "ले चल", "ले जा", "दिखा", "शुरू", "चलो", "जाओ", "जाना", "open", "go to", "take me", "show", "start"];

  /* ---------- Brain ---------- */
  function understand(raw) {
    const t = " " + raw.toLowerCase().replace(/[।?!,.]/g, " ") + " ";
    const wantsNav = has(t, NAV_VERBS);

    // specific topic first
    for (const tp of TOPICS) {
      if (has(t, tp.kw)) {
        return wantsNav
          ? { reply: "बिल्कुल, मैं यह सेक्शन अभी खोल रही हूँ।", action: { go: tp.go } }
          : { reply: tp.say + " क्या मैं इसे खोल दूँ?", action: null, pending: { go: tp.go } };
      }
    }
    for (const it of INTENTS) {
      if (has(t, it.kw)) {
        const a = it.go ? (it.go.startsWith("#") ? { scroll: it.go } : { go: it.go }) : null;
        return { reply: it.reply(), action: a };
      }
    }
    return null;
  }

  /* ---------- Actions ---------- */
  function run(action) {
    if (!action) return;
    if (action.scroll) {
      const el = document.querySelector(action.scroll);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else location.href = new URL("index.html" + action.scroll, location.href).href;
    } else if (action.go) {
      const path = PAGES[action.go] || action.go;
      setTimeout(() => { location.href = new URL(path, location.href).href; }, 2200);
    }
  }

  /* ---------- Speech ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;
  let voice = null, rec = null, listening = false, speaking = false, pending = null;
  const history = [];

  function pickVoice() {
    const vs = synth ? synth.getVoices() : [];
    voice = vs.find(v => /hi[-_]IN/i.test(v.lang) && /female|google|lekha|swara/i.test(v.name)) ||
            vs.find(v => /hi[-_]IN/i.test(v.lang)) || null;
  }
  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }

  function speak(text, done) {
    if (!synth) { done && done(); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN"; if (voice) u.voice = voice; u.rate = 0.95; u.pitch = 1.1;
    u.onstart = () => { speaking = true; setState("बोल रही हूँ…"); };
    u.onend = u.onerror = () => { speaking = false; setState("तैयार"); done && done(); };
    synth.speak(u);
  }

  async function respond(userText) {
    addMsg("user", userText);
    history.push({ role: "user", text: userText });
    const t = userText.toLowerCase();

    // yes/no for a pending suggestion
    if (pending && has(" " + t + " ", ["हाँ", "हां", "जी", "ठीक", "खोल", "yes", "ok", "okay"])) {
      const a = { go: pending.go.startsWith("#") ? undefined : pending.go, scroll: pending.go.startsWith("#") ? pending.go : undefined };
      pending = null; return say("ठीक है, खोल रही हूँ।", a);
    }
    pending = null;

    let out = understand(userText);
    if (!out && window.LEARNIO_AGENT_ENDPOINT) {
      try {
        const r = await fetch(window.LEARNIO_AGENT_ENDPOINT, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userText, history: history.slice(-8) })
        });
        out = await r.json();
      } catch (e) { out = null; }
    }
    if (!out) out = { reply: "माफ़ कीजिए, मैं यह ठीक से नहीं समझ पाई। आप कोर्स, प्लान की कीमत, साइन अप या संपर्क के बारे में पूछ सकते हैं।" };
    if (out.pending) pending = out.pending;
    say(out.reply, out.action);
  }

  function say(text, action) {
    addMsg("bot", text);
    history.push({ role: "bot", text });
    speak(text);
    run(action);
  }

  function listen() {
    if (!SR) { say("आपका ब्राउज़र आवाज़ पहचान को सपोर्ट नहीं करता। कृपया Chrome या Edge इस्तेमाल करें, या नीचे लिखकर पूछें।"); return; }
    if (listening) { rec && rec.stop(); return; }
    synth && synth.cancel();
    rec = new SR(); rec.lang = "hi-IN"; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onstart = () => { listening = true; mic.classList.add("on"); setState("सुन रही हूँ…"); };
    rec.onend = () => { listening = false; mic.classList.remove("on"); if (!speaking) setState("तैयार"); };
    rec.onerror = e => {
      const m = e.error === "not-allowed" ? "माइक की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक चालू करें।" :
                e.error === "no-speech" ? "मुझे कुछ सुनाई नहीं दिया। कृपया दोबारा बोलिए।" : null;
      if (m) say(m);
    };
    rec.onresult = e => respond(e.results[0][0].transcript);
    rec.start();
  }

  /* ---------- UI ---------- */
  const css = `
  #lva-fab{position:fixed;right:20px;bottom:20px;z-index:99999;width:64px;height:64px;border-radius:50%;border:0;cursor:pointer;
    background:#ff7a59;color:#fff;font-size:30px;box-shadow:0 6px 18px rgba(255,122,89,.45);transition:transform .15s}
  #lva-fab:hover{transform:scale(1.07)} #lva-fab:focus-visible,#lva-mic:focus-visible,#lva-in:focus-visible{outline:3px solid #3a2e8f;outline-offset:2px}
  #lva-panel{position:fixed;right:20px;bottom:96px;z-index:99999;width:min(360px,calc(100vw - 40px));max-height:min(540px,calc(100vh - 130px));
    display:none;flex-direction:column;background:#fffaf3;border:2px solid #3a2e8f;border-radius:22px;overflow:hidden;
    font-family:"Noto Sans Devanagari","Mukta",system-ui,sans-serif;box-shadow:0 14px 40px rgba(58,46,143,.25)}
  #lva-panel.open{display:flex}
  #lva-head{background:#3a2e8f;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;font-weight:700}
  #lva-state{font-size:12px;font-weight:500;opacity:.85}
  #lva-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:160px}
  .lva-m{max-width:86%;padding:9px 12px;border-radius:16px;font-size:15px;line-height:1.5}
  .lva-m.bot{background:#ffe7a8;color:#2b2457;align-self:flex-start;border-bottom-left-radius:4px}
  .lva-m.user{background:#3a2e8f;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
  #lva-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}
  #lva-chips button{border:1.5px solid #3a2e8f;background:#fff;color:#3a2e8f;border-radius:999px;padding:4px 10px;font-size:13px;cursor:pointer;font-family:inherit}
  #lva-bar{display:flex;gap:8px;padding:10px;border-top:1px solid #e8dcc3;align-items:center}
  #lva-in{flex:1;border:1.5px solid #cdbf9f;border-radius:12px;padding:9px 10px;font-size:15px;font-family:inherit;min-width:0}
  #lva-mic{width:46px;height:46px;border-radius:50%;border:0;background:#ff7a59;color:#fff;font-size:22px;cursor:pointer;flex:none}
  #lva-mic.on{background:#d62839;animation:lvapulse 1s infinite}
  @keyframes lvapulse{50%{box-shadow:0 0 0 10px rgba(214,40,57,.2)}}
  @media (prefers-reduced-motion:reduce){#lva-mic.on{animation:none}#lva-fab{transition:none}}`;

  const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  const fab = el("button", { id: "lva-fab", "aria-label": "लर्नियो आवाज़ सहायक खोलें" }, "🎙️");
  const panel = el("div", { id: "lva-panel", role: "dialog", "aria-label": "लर्नियो आवाज़ सहायक" });
  const stateEl = el("span", { id: "lva-state" }, "तैयार");
  panel.appendChild(el("div", { id: "lva-head" }, [el("span", {}, "🌈 लर्नियो सहायक"), stateEl]));
  const log = el("div", { id: "lva-log", "aria-live": "polite" }); panel.appendChild(log);

  const chips = el("div", { id: "lva-chips" });
  ["कोर्स क्या हैं?", "प्लान की कीमत", "फ्री प्लान", "साइन अप करना है", "संपर्क"].forEach(c => {
    const b = el("button", {}, c); b.onclick = () => respond(c); chips.appendChild(b);
  });
  panel.appendChild(chips);

  const input = el("input", { id: "lva-in", type: "text", placeholder: "यहाँ लिखें…", "aria-label": "संदेश लिखें" });
  const mic = el("button", { id: "lva-mic", "aria-label": "बोलने के लिए दबाएँ" }, "🎤");
  panel.appendChild(el("div", { id: "lva-bar" }, [input, mic]));
  document.body.appendChild(panel); document.body.appendChild(fab);

  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (typeof kids === "string") n.textContent = kids;
    else (kids || []).forEach(c => n.appendChild(c));
    return n;
  }
  function addMsg(who, text) {
    log.appendChild(el("div", { class: "lva-m " + who }, text));
    log.scrollTop = log.scrollHeight;
  }
  function setState(s) { stateEl.textContent = s; }

  let greeted = false;
  fab.onclick = () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open") && !greeted) {
      greeted = true;
      say("नमस्ते! मैं लर्नियो की सहायक हूँ। माइक दबाकर हिंदी में बोलिए, या नीचे लिखकर पूछिए।");
    }
    if (!panel.classList.contains("open")) { synth && synth.cancel(); rec && rec.stop(); }
  };
  mic.onclick = listen;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && input.value.trim()) { respond(input.value.trim()); input.value = ""; }
  });
})();
