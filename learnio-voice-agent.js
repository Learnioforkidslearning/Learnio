/*
 * Learnio Voice Agent  (drop-in widget) — Hindi / English / Bangla
 * Add before </body> on every page:
 *   <script src="learnio-voice-agent.js"></script>
 *
 * Works in Chrome / Edge / Android Chrome (Web Speech API).
 *
 * Optional settings (set BEFORE loading this script):
 *   window.LEARNIO_AGENT_ENDPOINT = "https://your-server/agent";
 *     -> receives {message, history, lang} and returns {reply, action?}
 *        where action is e.g. {"go":"math.html"} or {"scroll":"#pricing"}
 *   window.LEARNIO_AGENT_LANG = "hi" | "en" | "bn";   // default language
 *
 * Optional API after load:
 *   window.LearnioVoiceAgent.setLanguage("bn");
 */
(function () {
  "use strict";

  /* ================================================================
   * 1. LANGUAGES
   * ================================================================ */
  const LANGS = {
    hi: { code: "hi-IN", label: "हिन्दी",  voiceLangs: ["hi-in", "hi"] },
    en: { code: "en-IN", label: "English", voiceLangs: ["en-in", "en-us", "en-gb", "en"] },
    bn: { code: "bn-IN", label: "বাংলা",   voiceLangs: ["bn-in", "bn-bd", "bn"] }
  };
  const LANG_ORDER = ["hi", "en", "bn"];
  const STORE_KEY = "learnio-agent-lang";

  /* ================================================================
   * 2. INTERFACE TEXT
   * ================================================================ */
  const UI = {
    hi: {
      title: "🌈 लर्नियो सहायक",
      fab: "लर्नियो आवाज़ सहायक खोलें",
      panel: "लर्नियो आवाज़ सहायक",
      langGroup: "भाषा चुनें",
      placeholder: "यहाँ लिखें…",
      inputLabel: "संदेश लिखें",
      micLabel: "बोलने के लिए दबाएँ",
      state: { ready: "तैयार", listening: "सुन रही हूँ…", speaking: "बोल रही हूँ…" },
      chips: ["कोर्स क्या हैं?", "प्लान की कीमत", "फ्री प्लान", "साइन अप करना है", "संपर्क"],
      greet: "नमस्ते! मैं लर्नियो की सहायक हूँ। माइक दबाकर हिंदी में बोलिए, या नीचे लिखकर पूछिए।",
      fallback: "माफ़ कीजिए, मैं यह ठीक से नहीं समझ पाई। आप कोर्स, प्लान की कीमत, साइन अप या संपर्क के बारे में पूछ सकते हैं।",
      noSR: "आपका ब्राउज़र आवाज़ पहचान को सपोर्ट नहीं करता। कृपया Chrome या Edge इस्तेमाल करें, या नीचे लिखकर पूछें।",
      micDenied: "माइक की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक चालू करें।",
      noSpeech: "मुझे कुछ सुनाई नहीं दिया। कृपया दोबारा बोलिए।",
      langUnsupported: "इस ब्राउज़र में हिंदी आवाज़ पहचान उपलब्ध नहीं है। कृपया नीचे लिखकर पूछें।",
      noVoice: "इस डिवाइस पर हिंदी आवाज़ नहीं मिली, इसलिए मैं जवाब सिर्फ़ लिखकर दिखाऊँगी।",
      openNow: "बिल्कुल, मैं यह सेक्शन अभी खोल रही हूँ।",
      openAsk: " क्या मैं इसे खोल दूँ?",
      okOpening: "ठीक है, खोल रही हूँ।"
    },
    en: {
      title: "🌈 Learnio Helper",
      fab: "Open Learnio voice assistant",
      panel: "Learnio voice assistant",
      langGroup: "Choose language",
      placeholder: "Type here…",
      inputLabel: "Type your message",
      micLabel: "Press to speak",
      state: { ready: "Ready", listening: "Listening…", speaking: "Speaking…" },
      chips: ["What courses are there?", "Plan prices", "Free plan", "I want to sign up", "Contact us"],
      greet: "Hello! I'm the Learnio helper. Tap the mic and speak in English, or type your question below.",
      fallback: "Sorry, I didn't quite understand that. You can ask me about courses, plan prices, signing up or contacting us.",
      noSR: "Your browser doesn't support voice recognition. Please use Chrome or Edge, or type your question below.",
      micDenied: "Microphone permission was denied. Please turn on the mic in your browser settings.",
      noSpeech: "I couldn't hear anything. Please try speaking again.",
      langUnsupported: "English voice recognition isn't available in this browser. Please type your question below.",
      noVoice: "No English voice was found on this device, so I'll show my answers as text only.",
      openNow: "Sure, I'm opening that section right now.",
      openAsk: " Shall I open it for you?",
      okOpening: "Okay, opening it now."
    },
    bn: {
      title: "🌈 লার্নিও সহকারী",
      fab: "লার্নিও ভয়েস সহকারী খুলুন",
      panel: "লার্নিও ভয়েস সহকারী",
      langGroup: "ভাষা বেছে নিন",
      placeholder: "এখানে লিখুন…",
      inputLabel: "আপনার বার্তা লিখুন",
      micLabel: "বলতে চাপ দিন",
      state: { ready: "প্রস্তুত", listening: "শুনছি…", speaking: "বলছি…" },
      chips: ["কোর্সগুলো কী কী?", "প্ল্যানের দাম", "ফ্রি প্ল্যান", "সাইন আপ করতে চাই", "যোগাযোগ"],
      greet: "নমস্কার! আমি লার্নিওর সহকারী। মাইক চেপে বাংলায় বলুন, অথবা নিচে লিখে জিজ্ঞাসা করুন।",
      fallback: "দুঃখিত, আমি ঠিকভাবে বুঝতে পারিনি। আপনি কোর্স, প্ল্যানের দাম, সাইন আপ বা যোগাযোগ সম্পর্কে জিজ্ঞাসা করতে পারেন।",
      noSR: "আপনার ব্রাউজার ভয়েস রিকগনিশন সমর্থন করে না। অনুগ্রহ করে Chrome বা Edge ব্যবহার করুন, অথবা নিচে লিখে জিজ্ঞাসা করুন।",
      micDenied: "মাইক্রোফোনের অনুমতি পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজারে মাইক চালু করুন।",
      noSpeech: "আমি কিছু শুনতে পাইনি। অনুগ্রহ করে আবার বলুন।",
      langUnsupported: "এই ব্রাউজারে বাংলা ভয়েস রিকগনিশন পাওয়া যাচ্ছে না। অনুগ্রহ করে নিচে লিখে জিজ্ঞাসা করুন।",
      noVoice: "এই ডিভাইসে বাংলা ভয়েস পাওয়া যায়নি, তাই আমি উত্তর শুধু লিখে দেখাব।",
      openNow: "অবশ্যই, আমি এই বিভাগটি এখনই খুলছি।",
      openAsk: " আমি কি এটি খুলে দেব?",
      okOpening: "ঠিক আছে, খুলছি।"
    }
  };

  /* ================================================================
   * 3. KNOWLEDGE ABOUT THE SITE
   * Keywords are matched against the active language PLUS English
   * (so mixed speech like "plan ki price" still works).
   * Keywords with spaces around them match whole words only.
   * ================================================================ */
  const PAGES = {
    alphabet: "alphabet.html", math: "math.html", science: "science.html",
    drawing: "drawing.html", games: "fun/index.html",
    login: "login.html", signup: "signup.html"
  };

  const TOPICS = [
    {
      id: "alphabet", go: "alphabet",
      kw: {
        hi: ["अल्फाबेट", "वर्णमाला", "अक्षर", "फोनिक्स"],
        en: ["alphabet", "phonics", "letters", " abc "],
        bn: ["অ্যালফাবেট", "আলফাবেট", "বর্ণমালা", "অক্ষর", "ফনিক্স"]
      },
      say: {
        hi: "अल्फाबेट और फोनिक्स कोर्स में बच्चे रंगीन एनिमेशन के साथ अक्षर, उनकी आवाज़ें और शब्द सीखते हैं। यह हमारा सबसे लोकप्रिय कोर्स है।",
        en: "In the Alphabet and Phonics course, children learn letters, their sounds and new words through colourful animations. It's our most popular course.",
        bn: "অ্যালফাবেট ও ফনিক্স কোর্সে শিশুরা রঙিন অ্যানিমেশনের সাথে অক্ষর, তাদের ধ্বনি আর শব্দ শেখে। এটি আমাদের সবচেয়ে জনপ্রিয় কোর্স।"
      }
    },
    {
      id: "math", go: "math",
      kw: {
        hi: ["गणित", "मैथ", "गिनती", "जोड़", "घटाव"],
        en: ["math", "counting", "numbers", "addition", "subtraction"],
        bn: ["গণিত", "অঙ্ক", "ম্যাথ", "গোনা", "গুনতি", " যোগ ", " বিয়োগ "]
      },
      say: {
        hi: "नंबर और मैथ सेक्शन में गिनती, जोड़, घटाव और मज़ेदार गणित के खेल हैं।",
        en: "The Numbers and Math section has counting, addition, subtraction and fun maths games.",
        bn: "সংখ্যা ও অঙ্ক বিভাগে গোনা, যোগ, বিয়োগ আর মজার অঙ্কের খেলা আছে।"
      }
    },
    {
      id: "science", go: "science",
      kw: {
        hi: ["साइंस", "विज्ञान", "जानवर", "प्रकृति", "ग्रह", "मौसम"],
        en: ["science", "animals", "nature", "planets", "weather"],
        bn: ["বিজ্ঞান", "সায়েন্স", "প্রাণী", "জীবজন্তু", "প্রকৃতি", "গ্রহ", "আবহাওয়া"]
      },
      say: {
        hi: "साइंस और नेचर में बच्चे जानवर, ग्रह, मौसम और आसान प्रयोगों के बारे में सीखते हैं।",
        en: "In Science and Nature, children learn about animals, planets, weather and easy experiments.",
        bn: "বিজ্ঞান ও প্রকৃতি বিভাগে শিশুরা প্রাণী, গ্রহ, আবহাওয়া আর সহজ পরীক্ষা-নিরীক্ষা সম্পর্কে শেখে।"
      }
    },
    {
      id: "drawing", go: "drawing",
      kw: {
        hi: ["ड्रॉइंग", "ड्राइंग", "चित्र", "पेंटिंग", "रंग भर"],
        en: ["drawing", "painting", " art ", "colouring", "coloring"],
        bn: ["ড্রয়িং", "আঁকা", "আঁকতে", "ছবি", "পেইন্টিং", "রং করা", "রং"]
      },
      say: {
        hi: "ड्रॉइंग और क्रिएटिविटी सेक्शन में बच्चे इंटरैक्टिव टूल्स से चित्र बना सकते हैं और रंग भर सकते हैं।",
        en: "In Drawing and Creativity, children can draw pictures and colour them in using interactive tools.",
        bn: "ড্রয়িং ও সৃজনশীলতা বিভাগে শিশুরা ইন্টারঅ্যাকটিভ টুল দিয়ে ছবি আঁকতে ও রং করতে পারে।"
      }
    },
    {
      id: "games", go: "games",
      kw: {
        hi: ["गेम", "खेल", "बैलून", "फ्रूट", "मेमोरी"],
        en: ["game", "games", " fun ", "balloon", "fruit", "memory"],
        bn: ["গেম", "খেলা", "খেলাধুলা", "বেলুন", " ফল ", "ফ্রুট", "মেমরি", "মেমোরি"]
      },
      say: {
        hi: "फन एक्टिविटीज़ में बैलून पॉप, फ्रूट कैच, हैंड कनेक्ट और मेमोरी चैलेंज जैसे खेल हैं, जो ध्यान और सोचने की क्षमता बढ़ाते हैं।",
        en: "Fun Activities has games like Balloon Pop, Fruit Catch, Hand Connect and the Memory Challenge, which build focus and thinking skills.",
        bn: "মজার অ্যাক্টিভিটিতে বেলুন পপ, ফ্রুট ক্যাচ, হ্যান্ড কানেক্ট আর মেমরি চ্যালেঞ্জের মতো খেলা আছে, যা মনোযোগ ও চিন্তাশক্তি বাড়ায়।"
      }
    }
  ];

  /*
   * ORDER MATTERS: the first matching intent wins.
   * sixmonth and yearly come BEFORE monthly so that "499" / "999"
   * are not caught by the "99" keyword.
   */
  const INTENTS = [
    {
      name: "bye",
      kw: {
        hi: ["अलविदा", "बाय", "धन्यवाद", "शुक्रिया"],
        en: [" bye", "thanks", "thank you", "goodbye"],
        bn: ["বিদায়", "ধন্যবাদ", "বাই", "আবার দেখা হবে"]
      },
      reply: {
        hi: "आपका धन्यवाद! बच्चों को सीखने में मज़ा आए। जब चाहें मुझे फिर बुला लीजिए।",
        en: "Thank you! I hope the children have fun learning. Call me again whenever you like.",
        bn: "আপনাকে ধন্যবাদ! শিশুদের শিখতে ভালো লাগুক। যখন ইচ্ছা আমাকে আবার ডাকবেন।"
      }
    },
    {
      name: "greet",
      kw: {
        hi: ["नमस्ते", "हेलो", "हैलो", "हाय"],
        en: ["hello", " hi ", " hey "],
        bn: ["নমস্কার", "হ্যালো", "হাই", "হ্যাল্লো"]
      },
      reply: {
        hi: "नमस्ते! मैं लर्नियो की सहायक हूँ। आप कोर्स, प्लान की कीमत, साइन अप या किसी भी चीज़ के बारे में पूछ सकते हैं।",
        en: "Hello! I'm the Learnio helper. You can ask me about courses, plan prices, signing up, or anything else.",
        bn: "নমস্কার! আমি লার্নিওর সহকারী। আপনি কোর্স, প্ল্যানের দাম, সাইন আপ বা যেকোনো বিষয়ে জিজ্ঞাসা করতে পারেন।"
      }
    },
    {
      name: "free",
      kw: {
        hi: ["फ्री", "मुफ्त", "मुफ़्त"],
        en: ["free"],
        bn: ["ফ্রি", "বিনামূল্যে", "বিনা পয়সায়", "ফ্রী"]
      },
      reply: {
        hi: "फ्री प्लान बिल्कुल मुफ़्त है। इसमें पाँच लेसन, बेसिक एक्टिविटीज़, कम्युनिटी एक्सेस और कुछ वीडियो मिलते हैं। शुरू करने के लिए साइन अप कर लीजिए।",
        en: "The Free plan is completely free. It includes five lessons, basic activities, community access and a few videos. Just sign up to get started.",
        bn: "ফ্রি প্ল্যান সম্পূর্ণ বিনামূল্যে। এতে পাঁচটি পাঠ, বেসিক অ্যাক্টিভিটি, কমিউনিটি অ্যাক্সেস আর কিছু ভিডিও পাওয়া যায়। শুরু করতে সাইন আপ করে নিন।"
      }
    },
    {
      name: "sixmonth",
      kw: {
        hi: ["छह महीने", "छः महीने", "6 महीने", "चार सौ"],
        en: ["six month", "six-month", "6 month", "6-month", "half year", "half-year", "499", "four hundred"],
        bn: ["ছয় মাস", "ছ'মাস", "৬ মাস", "৪৯৯", "চারশো", "চারশ"]
      },
      reply: {
        hi: "छह महीने का प्लान चार सौ निन्यानवे रुपये का है। इसमें सभी प्रीमियम फीचर, खास एनिमेशन, वर्कशीट डाउनलोड और प्राथमिकता सहायता मिलती है।",
        en: "The 6-month plan is 499 rupees. It includes all premium features, special animations, worksheet downloads and priority support.",
        bn: "ছয় মাসের প্ল্যান চারশো নিরানব্বই টাকার। এতে সব প্রিমিয়াম ফিচার, বিশেষ অ্যানিমেশন, ওয়ার্কশিট ডাউনলোড আর অগ্রাধিকার সহায়তা পাওয়া যায়।"
      }
    },
    {
      name: "yearly",
      kw: {
        hi: ["सालाना", "साल का", "नौ सौ"],
        en: ["yearly", "annual", "year", "999", "nine hundred"],
        bn: ["বার্ষিক", "বছরের", "বাৎসরিক", "ইয়ারলি", "৯৯৯", "নয়শো", "নয়শ"]
      },
      reply: {
        hi: "सालाना प्लान नौ सौ निन्यानवे रुपये का है। इसमें सब कुछ शामिल है: अनलिमिटेड एक्सेस, प्रीमियम लर्निंग पैक और बच्चे की प्रगति की ट्रैकिंग।",
        en: "The yearly plan is 999 rupees. It includes everything: unlimited access, the premium learning pack and progress tracking for your child.",
        bn: "বার্ষিক প্ল্যান নয়শো নিরানব্বই টাকার। এতে সবকিছু আছে: আনলিমিটেড অ্যাক্সেস, প্রিমিয়াম লার্নিং প্যাক আর শিশুর অগ্রগতি ট্র্যাকিং।"
      },
      go: "#pricing"
    },
    {
      name: "monthly",
      kw: {
        hi: ["मंथली", "महीने का", "एक महीने", "निन्यानवे"],
        en: ["monthly", "per month", "one month", "a month", "99", "ninety"],
        bn: ["মাসিক", "মান্থলি", "মাসের", "এক মাস", "৯৯", "নিরানব্বই"]
      },
      reply: {
        hi: "मंथली प्लान निन्यानवे रुपये महीना है। इसमें अनलिमिटेड लेसन, प्रीमियम वीडियो, ड्रॉइंग एक्टिविटीज़ और पेरेंट डैशबोर्ड मिलता है।",
        en: "The monthly plan is 99 rupees a month. It includes unlimited lessons, premium videos, drawing activities and the parent dashboard.",
        bn: "মাসিক প্ল্যান মাসে নিরানব্বই টাকা। এতে আনলিমিটেড পাঠ, প্রিমিয়াম ভিডিও, ড্রয়িং অ্যাক্টিভিটি আর প্যারেন্ট ড্যাশবোর্ড পাওয়া যায়।"
      }
    },
    {
      name: "pricing",
      kw: {
        hi: ["कीमत", "दाम", "पैसे", "प्लान", "सब्सक्रिप्शन", "कितना", "रुपये", "प्रीमियम"],
        en: ["price", "plan", "pricing", "subscription", "cost", "premium", "how much", "rupees"],
        bn: ["দাম", "মূল্য", "প্ল্যান", "প্লান", "সাবস্ক্রিপশন", "কত", "টাকা", "প্রিমিয়াম"]
      },
      reply: {
        hi: "हमारे चार प्लान हैं। फ्री प्लान शून्य रुपये महीना, जिसमें पाँच मुफ़्त लेसन हैं। मंथली प्लान निन्यानवे रुपये महीना, जिसमें अनलिमिटेड लेसन और पेरेंट डैशबोर्ड है। छह महीने का प्लान चार सौ निन्यानवे रुपये का है। और सालाना प्लान नौ सौ निन्यानवे रुपये का, जिसमें सब कुछ शामिल है।",
        en: "We have four plans. The Free plan costs nothing and includes five free lessons. The monthly plan is 99 rupees a month, with unlimited lessons and the parent dashboard. The 6-month plan is 499 rupees. And the yearly plan is 999 rupees, with everything included.",
        bn: "আমাদের চারটি প্ল্যান আছে। ফ্রি প্ল্যান শূন্য টাকা, এতে পাঁচটি বিনামূল্যের পাঠ আছে। মাসিক প্ল্যান মাসে নিরানব্বই টাকা, এতে আনলিমিটেড পাঠ আর প্যারেন্ট ড্যাশবোর্ড আছে। ছয় মাসের প্ল্যান চারশো নিরানব্বই টাকার। আর বার্ষিক প্ল্যান নয়শো নিরানব্বই টাকার, যাতে সবকিছু আছে।"
      },
      go: "#pricing"
    },
    {
      name: "signup",
      kw: {
        hi: ["साइन अप", "साइनअप", "रजिस्टर", "खाता बना"],
        en: ["sign up", "signup", "sign-up", "register", "create account", "create an account"],
        bn: ["সাইন আপ", "সাইনআপ", "রেজিস্টার", "নিবন্ধন", "অ্যাকাউন্ট খুল", "অ্যাকাউন্ট তৈরি"]
      },
      reply: {
        hi: "ठीक है, मैं आपको साइन अप पेज पर ले जा रही हूँ।",
        en: "Okay, I'm taking you to the sign up page.",
        bn: "ঠিক আছে, আমি আপনাকে সাইন আপ পেজে নিয়ে যাচ্ছি।"
      },
      go: "signup"
    },
    {
      name: "login",
      kw: {
        hi: ["लॉगिन", "लॉग इन"],
        en: ["login", "log in", "sign in", "signin"],
        bn: ["লগইন", "লগ ইন", "সাইন ইন"]
      },
      reply: {
        hi: "ठीक है, मैं आपको लॉगिन पेज पर ले जा रही हूँ।",
        en: "Okay, I'm taking you to the login page.",
        bn: "ঠিক আছে, আমি আপনাকে লগইন পেজে নিয়ে যাচ্ছি।"
      },
      go: "login"
    },
    {
      name: "parents",
      kw: {
        hi: ["पेरेंट", "अभिभावक", "माता", "टीचर", "शिक्षक", "सुरक्षित", "विज्ञापन", "रिपोर्ट", "वर्कशीट", "प्रगति"],
        en: ["parent", "teacher", " safe", " ads", "report", "worksheet", "progress"],
        bn: ["প্যারেন্ট", "অভিভাবক", "বাবা-মা", "মা-বাবা", "শিক্ষক", "টিচার", "নিরাপদ", "বিজ্ঞাপন", "রিপোর্ট", "ওয়ার্কশিট", "অগ্রগতি"]
      },
      reply: {
        hi: "लर्नियो पूरी तरह सुरक्षित और विज्ञापन-मुक्त है, यहाँ कोई अजनबी नहीं है। माता-पिता को हर हफ़्ते बच्चे की प्रगति की रिपोर्ट मिलती है, और शिक्षक वर्कशीट और लेसन प्लान प्रिंट करके क्लासरूम में इस्तेमाल कर सकते हैं।",
        en: "Learnio is completely safe and ad-free, and there are no strangers here. Parents get a weekly progress report for their child, and teachers can print worksheets and lesson plans to use in the classroom.",
        bn: "লার্নিও সম্পূর্ণ নিরাপদ ও বিজ্ঞাপনমুক্ত, এখানে কোনো অপরিচিত মানুষ নেই। অভিভাবকরা প্রতি সপ্তাহে শিশুর অগ্রগতির রিপোর্ট পান, আর শিক্ষকরা ওয়ার্কশিট ও পাঠ পরিকল্পনা প্রিন্ট করে ক্লাসরুমে ব্যবহার করতে পারেন।"
      },
      go: "#parents"
    },
    {
      name: "contact",
      kw: {
        hi: ["संपर्क", "सम्पर्क", "सहायता", "मदद", "शिकायत", "कॉन्टैक्ट"],
        en: ["contact", "support", "help", "complaint"],
        bn: ["যোগাযোগ", "সাহায্য", "সহায়তা", "অভিযোগ", "কন্টাক্ট", "কনট্যাক্ট"]
      },
      reply: {
        hi: "आप हमसे वेबसाइट के संपर्क फ़ॉर्म से जुड़ सकते हैं। मैं आपको वहाँ ले चलती हूँ, बस अपना संदेश भरकर भेज दीजिए।",
        en: "You can reach us through the contact form on the website. I'll take you there, just fill in your message and send it.",
        bn: "আপনি আমাদের ওয়েবসাইটের যোগাযোগ ফর্মের মাধ্যমে আমাদের সঙ্গে যোগাযোগ করতে পারেন। আমি আপনাকে সেখানে নিয়ে যাচ্ছি, শুধু আপনার বার্তা লিখে পাঠিয়ে দিন।"
      },
      go: "#contact"
    },
    {
      name: "courses",
      kw: {
        hi: ["कोर्स", "कौन सी चीज़", "क्या सीख", "सिखा"],
        en: ["course", "courses", "learn", "lessons", "subjects"],
        bn: ["কোর্স", "কী শেখ", "কি শেখ", "শেখায়", "শেখানো", "পাঠ"]
      },
      reply: {
        hi: "हमारे पाँच सेक्शन हैं: अल्फाबेट और फोनिक्स, नंबर और मैथ, साइंस और नेचर, ड्रॉइंग और क्रिएटिविटी, और फन गेम्स। आप किसके बारे में जानना चाहेंगे?",
        en: "We have five sections: Alphabet and Phonics, Numbers and Math, Science and Nature, Drawing and Creativity, and Fun Games. Which one would you like to know about?",
        bn: "আমাদের পাঁচটি বিভাগ আছে: অ্যালফাবেট ও ফনিক্স, সংখ্যা ও অঙ্ক, বিজ্ঞান ও প্রকৃতি, ড্রয়িং ও সৃজনশীলতা, আর মজার গেম। আপনি কোনটি সম্পর্কে জানতে চান?"
      },
      go: "#courses"
    }
  ];

  const NAV_VERBS = {
    hi: ["खोल", "ले चल", "ले जा", "दिखा", "शुरू", "चलो", "जाओ", "जाना"],
    en: ["open", "go to", "take me", "show", "start"],
    bn: ["খোল", "খুলে", "নিয়ে চল", "নিয়ে যাও", "দেখাও", "শুরু", "চলো", "যাও", "যেতে"]
  };

  const YES_WORDS = {
    hi: [" हाँ ", " हां ", " जी ", "ठीक", "खोल"],
    en: [" yes ", " yeah ", " yep ", " sure ", " ok ", " okay ", " please ", "open"],
    bn: [" হ্যাঁ ", " হ্যা ", " হাঁ ", " জি ", "ঠিক", "খোল", "খুলে"]
  };

  /* ================================================================
   * 4. BRAIN
   * ================================================================ */
  let cur = "hi";            // active language key
  let stateKey = "ready";
  let pending = null;        // suggestion waiting for yes/no
  const history = [];

  const T = () => UI[cur];

  // lower-case, strip punctuation, pad with spaces (enables whole-word keywords)
  function norm(raw) {
    return " " + raw.toLowerCase().replace(/[।॥?!,.;:"“”‘’()]/g, " ").replace(/\s+/g, " ") + " ";
  }
  const has = (t, words) => words.some(w => t.includes(w));
  const kwFor = kw => (kw[cur] || []).concat(cur === "en" ? [] : (kw.en || []));
  const toAction = g => (g ? (g.startsWith("#") ? { scroll: g } : { go: g }) : null);

  function understand(raw) {
    const t = norm(raw);
    const wantsNav = has(t, NAV_VERBS[cur].concat(cur === "en" ? [] : NAV_VERBS.en));

    for (const tp of TOPICS) {
      if (has(t, kwFor(tp.kw))) {
        return wantsNav
          ? { reply: T().openNow, action: { go: tp.go } }
          : { reply: tp.say[cur] + T().openAsk, action: null, pending: { go: tp.go } };
      }
    }
    for (const it of INTENTS) {
      if (has(t, kwFor(it.kw))) return { reply: it.reply[cur], action: toAction(it.go) };
    }
    return null;
  }

  /* ================================================================
   * 5. ACTIONS
   * ================================================================ */
  function run(action) {
    if (!action) return;
    if (action.scroll) {
      const target = document.querySelector(action.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else location.href = new URL("index.html" + action.scroll, location.href).href;
    } else if (action.go) {
      const path = PAGES[action.go] || action.go;
      setTimeout(() => { location.href = new URL(path, location.href).href; }, 2200);
    }
  }

  /* ================================================================
   * 6. SPEECH
   * ================================================================ */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;
  let voice = null, rec = null, listening = false, speaking = false;
  const warnedNoVoice = {};

  const normLang = l => (l || "").toLowerCase().replace("_", "-");

  function pickVoice() {
    voice = null;
    const vs = synth ? synth.getVoices() : [];
    if (!vs.length) return;
    const nice = /female|google|lekha|swara|neerja|heera|veena|tanishaa|priya|kalpana/i;
    for (const pref of LANGS[cur].voiceLangs) {
      const matches = vs.filter(v => {
        const l = normLang(v.lang);
        return pref.includes("-") ? l === pref : (l === pref || l.startsWith(pref + "-"));
      });
      if (matches.length) {
        voice = matches.find(v => nice.test(v.name)) || matches[0];
        return;
      }
    }
  }
  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }

  function speak(text, done) {
    if (!synth) { done && done(); return; }
    pickVoice();
    if (!voice && synth.getVoices().length && !warnedNoVoice[cur]) {
      warnedNoVoice[cur] = true;
      addMsg("bot", T().noVoice);
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANGS[cur].code;
    if (voice) u.voice = voice;
    u.rate = 0.95; u.pitch = 1.1;
    u.onstart = () => { speaking = true; setState("speaking"); };
    u.onend = u.onerror = () => { speaking = false; setState(listening ? "listening" : "ready"); done && done(); };
    synth.speak(u);
  }

  async function respond(userText) {
    addMsg("user", userText);
    history.push({ role: "user", text: userText });
    const t = norm(userText);

    // yes/no for a pending suggestion
    if (pending && has(t, YES_WORDS[cur])) {
      const a = toAction(pending.go);
      pending = null;
      return say(T().okOpening, a);
    }
    pending = null;

    let out = understand(userText);
    if (!out && window.LEARNIO_AGENT_ENDPOINT) {
      try {
        const r = await fetch(window.LEARNIO_AGENT_ENDPOINT, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userText, history: history.slice(-8), lang: cur })
        });
        out = await r.json();
      } catch (e) { out = null; }
    }
    if (!out || !out.reply) out = { reply: T().fallback };
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
    if (!SR) { say(T().noSR); return; }
    if (listening) { rec && rec.stop(); return; }
    synth && synth.cancel();
    rec = new SR();
    rec.lang = LANGS[cur].code;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => { listening = true; mic.classList.add("on"); setState("listening"); };
    rec.onend = () => { listening = false; mic.classList.remove("on"); if (!speaking) setState("ready"); };
    rec.onerror = e => {
      const m = e.error === "not-allowed" || e.error === "service-not-allowed" ? T().micDenied :
                e.error === "no-speech" ? T().noSpeech :
                e.error === "language-not-supported" ? T().langUnsupported : null;
      if (m) say(m);
    };
    rec.onresult = e => respond(e.results[0][0].transcript);
    rec.start();
  }

  /* ================================================================
   * 7. UI
   * ================================================================ */
  const css = `
  #lva-fab{
    position:fixed;right:28px;bottom:115px;z-index:100000;
    width:82px;height:82px;border-radius:50%;border:4px solid #ffffff;cursor:pointer;
    background:linear-gradient(145deg,#ff9275,#ff654f);color:#fff;font-size:38px;
    box-shadow:0 8px 25px rgba(255,122,89,.40),0 0 0 6px rgba(255,122,89,.10);
    transition:all .25s ease}
  #lva-fab:hover{transform:scale(1.10)}
  #lva-fab:focus-visible,#lva-mic:focus-visible,#lva-in:focus-visible,#lva-langs button:focus-visible,#lva-chips button:focus-visible{outline:3px solid #3a2e8f;outline-offset:2px}
  #lva-panel{
    position:fixed;right:28px;bottom:207px;z-index:99999;
    width:min(360px,calc(100vw - 40px));max-height:min(540px,calc(100vh - 130px));
    display:none;flex-direction:column;background:#fffaf3;border:2px solid #3a2e8f;border-radius:22px;overflow:hidden;
    font-family:"Noto Sans Devanagari","Noto Sans Bengali","Mukta","Hind Siliguri",system-ui,sans-serif;
    box-shadow:0 14px 40px rgba(58,46,143,.25)}
  #lva-panel.open{display:flex}
  #lva-head{background:#3a2e8f;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;font-weight:700}
  #lva-state{font-size:12px;font-weight:500;opacity:.85}
  #lva-langs{display:flex;gap:6px;padding:8px 12px;background:#efe9ff;border-bottom:1px solid #d9d0f5}
  #lva-langs button{flex:1;border:1.5px solid #3a2e8f;background:#fff;color:#3a2e8f;border-radius:999px;padding:5px 8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap}
  #lva-langs button[aria-pressed="true"]{background:#3a2e8f;color:#fff}
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

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (typeof kids === "string") n.textContent = kids;
    else (kids || []).forEach(c => n.appendChild(c));
    return n;
  }

  const fab = el("button", { id: "lva-fab" }, "🎙️");
  const panel = el("div", { id: "lva-panel", role: "dialog" });
  const titleEl = el("span", {}, "");
  const stateEl = el("span", { id: "lva-state" }, "");
  panel.appendChild(el("div", { id: "lva-head" }, [titleEl, stateEl]));

  // language switcher
  const langBar = el("div", { id: "lva-langs", role: "group" });
  const langBtns = {};
  LANG_ORDER.forEach(k => {
    const b = el("button", { type: "button", lang: LANGS[k].code, "aria-pressed": "false" }, LANGS[k].label);
    b.onclick = () => setLang(k);
    langBtns[k] = b;
    langBar.appendChild(b);
  });
  panel.appendChild(langBar);

  const log = el("div", { id: "lva-log", "aria-live": "polite" });
  panel.appendChild(log);

  const chips = el("div", { id: "lva-chips" });
  panel.appendChild(chips);

  const input = el("input", { id: "lva-in", type: "text" });
  const mic = el("button", { id: "lva-mic", type: "button" }, "🎤");
  panel.appendChild(el("div", { id: "lva-bar" }, [input, mic]));
  document.body.appendChild(panel);
  document.body.appendChild(fab);

  function addMsg(who, text) {
    log.appendChild(el("div", { class: "lva-m " + who }, text));
    log.scrollTop = log.scrollHeight;
  }
  function setState(k) { stateKey = k; stateEl.textContent = T().state[k]; }

  function renderChips() {
    chips.textContent = "";
    T().chips.forEach(c => {
      const b = el("button", { type: "button" }, c);
      b.onclick = () => respond(c);
      chips.appendChild(b);
    });
  }

  // refresh every piece of language-dependent UI
  function applyUI() {
    const t = T();
    titleEl.textContent = t.title;
    setState(stateKey);
    fab.setAttribute("aria-label", t.fab);
    panel.setAttribute("aria-label", t.panel);
    panel.setAttribute("lang", LANGS[cur].code);
    langBar.setAttribute("aria-label", t.langGroup);
    input.setAttribute("placeholder", t.placeholder);
    input.setAttribute("aria-label", t.inputLabel);
    mic.setAttribute("aria-label", t.micLabel);
    LANG_ORDER.forEach(k => langBtns[k].setAttribute("aria-pressed", String(k === cur)));
    renderChips();
  }

  let greeted = false;

  function setLang(k) {
    if (!LANGS[k] || k === cur) return;
    // stop anything in progress in the old language
    synth && synth.cancel();
    if (rec) { try { rec.abort(); } catch (e) {} }
    listening = false; speaking = false; mic.classList.remove("on");
    pending = null;
    cur = k;
    try { localStorage.setItem(STORE_KEY, k); } catch (e) {}
    stateKey = "ready";
    pickVoice();
    applyUI();
    if (panel.classList.contains("open")) { greeted = true; say(T().greet); }
  }

  function initialLang() {
    let l = null;
    try { l = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (!LANGS[l]) l = window.LEARNIO_AGENT_LANG;
    if (!LANGS[l]) {
      const h = (document.documentElement.lang || navigator.language || "").slice(0, 2).toLowerCase();
      l = LANGS[h] ? h : "hi";
    }
    return l;
  }

  fab.onclick = () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open") && !greeted) {
      greeted = true;
      say(T().greet);
    }
    if (!panel.classList.contains("open")) {
      synth && synth.cancel();
      rec && rec.stop();
    }
  };
  mic.onclick = listen;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && input.value.trim()) { respond(input.value.trim()); input.value = ""; }
  });

  cur = initialLang();
  pickVoice();
  applyUI();

  // small public API
  window.LearnioVoiceAgent = { setLanguage: setLang, getLanguage: () => cur };
})();