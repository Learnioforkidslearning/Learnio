// ===========================================
// Learnio Seasonal Theme System
// ---------------------------------------------
// Detects the current date, picks a festival or seasonal theme, and
// applies it globally via document.body.dataset.theme. Colors are
// controlled entirely by CSS custom properties in seasonal-theme.css
// (body[data-theme="..."] blocks) — this file only decides WHICH
// theme applies and renders a few lightweight decorative particles.
//
// Completely separate from ai/ui.js (the chatbot widget). Do not
// merge the two.
//
// Manual preview (does not affect automatic detection for other
// visitors, and does not persist anywhere):
//   yoursite.com/index.html?theme=diwali
//   or, from the browser console: setSeasonalTheme("diwali")
//   or clear it: clearSeasonalTheme()
// ===========================================

(function () {
"use strict";

// -------------------------------------------
// 1. VALID THEME IDS
// -------------------------------------------
const VALID_THEMES = [
    "default",
    "winter",
    "christmas",
    "new-year",
    "republic-day",
    "holi",
    "poila-boishakh",
    "independence-day",
    "durga-puja",
    "diwali",
    "summer",
    "monsoon"
];

// -------------------------------------------
// 2. FESTIVAL CONFIG
// -------------------------------------------
// Two kinds of entries:
//
// type: "fixed"  -> same MM-DD range every year (Gregorian holidays).
//                   "start" > "end" is allowed and means the range
//                   wraps across the year boundary (e.g. New Year).
//
// type: "yearly" -> lunar/luni-solar festivals whose exact dates
//                   shift every year (Holi, Diwali, Durga Puja).
//                   Add a new entry to datesByYear each year. If the
//                   current year isn't listed, that festival is
//                   simply skipped (falls through to the seasonal
//                   default) rather than guessing a wrong date.
//
// Order = priority if ranges ever overlap (top wins).
const FESTIVALS = [
    {
        theme: "christmas",
        name: "Christmas",
        type: "fixed",
        start: "12-20",
        end: "12-26"
    },
    {
        theme: "new-year",
        name: "New Year",
        type: "fixed",
        start: "12-31",
        end: "01-01"
    },
    {
        theme: "republic-day",
        name: "Republic Day",
        type: "fixed",
        start: "01-24",
        end: "01-27"
    },
    {
        theme: "holi",
        name: "Holi",
        type: "yearly",
        datesByYear: {
            2026: { start: "2026-03-03", end: "2026-03-05" }
            // add future years here, e.g. 2027: { start: "...", end: "..." }
        }
    },
    {
        theme: "poila-boishakh",
        name: "Poila Boishakh (Bengali New Year)",
        type: "fixed",
        start: "04-14",
        end: "04-15"
    },
    {
        theme: "independence-day",
        name: "Independence Day",
        type: "fixed",
        start: "08-13",
        end: "08-16"
    },
    {
        theme: "durga-puja",
        name: "Durga Puja",
        type: "yearly",
        datesByYear: {
            2026: { start: "2026-10-17", end: "2026-10-21" } // Mahalaya -> Vijaya Dashami
        }
    },
    {
        theme: "diwali",
        name: "Diwali",
        type: "yearly",
        datesByYear: {
            2026: { start: "2026-11-06", end: "2026-11-10" } // Dhanteras -> Bhai Dooj window
        }
    }
];

// -------------------------------------------
// 3. GENERIC SEASONAL FALLBACK
// -------------------------------------------
// Checked only if no festival is active. Any month not covered here
// (Oct, Nov) falls through to "default".
const SEASONS = [
    { theme: "winter", months: [12, 1, 2] },
    { theme: "summer", months: [3, 4, 5, 6] },
    { theme: "monsoon", months: [7, 8, 9] }
];

// -------------------------------------------
// 4. DATE HELPERS
// -------------------------------------------

function pad(n) {
    return String(n).padStart(2, "0");
}

function mmdd(date) {
    return pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

// True if `date`'s MM-DD falls within [start, end] (both "MM-DD").
// Handles ranges that wrap the year boundary, e.g. start "12-31",
// end "01-01".
function isFixedRangeActive(date, start, end) {
    const current = mmdd(date);
    if (start <= end) {
        return current >= start && current <= end;
    }
    // wraps across Dec 31 -> Jan 1
    return current >= start || current <= end;
}

// True if `date` falls within [start, end] inclusive, both "YYYY-MM-DD".
function isYearlyRangeActive(date, start, end) {
    const startDate = new Date(start + "T00:00:00");
    const endDate = new Date(end + "T23:59:59");
    return date >= startDate && date <= endDate;
}

// -------------------------------------------
// 5. THEME DETECTION
// -------------------------------------------

function detectSeasonalTheme(date) {
    date = date || new Date();

    // Festivals take priority over generic seasons.
    for (const festival of FESTIVALS) {
        if (festival.type === "fixed") {
            if (isFixedRangeActive(date, festival.start, festival.end)) {
                return festival.theme;
            }
        } else if (festival.type === "yearly") {
            const range = festival.datesByYear[date.getFullYear()];
            if (range && isYearlyRangeActive(date, range.start, range.end)) {
                return festival.theme;
            }
        }
    }

    // No festival active -> generic season.
    const month = date.getMonth() + 1;
    for (const season of SEASONS) {
        if (season.months.indexOf(month) !== -1) {
            return season.theme;
        }
    }

    // Oct/Nov, or anything unmatched.
    return "default";
}

// -------------------------------------------
// 6. DECORATIVE PARTICLES
// -------------------------------------------
// Small, emoji-based, CSS-animated. No continuous JS animation loop —
// each particle is a plain element with a CSS animation, matching how
// the rest of the site already animates things.

const DECOR_CONTAINER_ID = "seasonal-decor";

const DECOR_MAP = {
    winter: { symbols: ["❄️"], count: 14, kind: "fall" },
    christmas: { symbols: ["❄️", "✨"], count: 14, kind: "fall" },
    "new-year": { symbols: ["🎉", "✨", "🎊"], count: 14, kind: "fall" },
    "republic-day": { symbols: ["🪁", "✨"], count: 10, kind: "twinkle" },
    holi: { symbols: ["🎨", "✨", "🌸"], count: 16, kind: "fall" },
    "poila-boishakh": { symbols: ["🌺", "✨"], count: 10, kind: "twinkle" },
    "independence-day": { symbols: ["🪁", "✨"], count: 10, kind: "twinkle" },
    "durga-puja": { symbols: ["🪔", "✨"], count: 10, kind: "glow" },
    diwali: { symbols: ["🪔"], count: 12, kind: "glow" },
    summer: { symbols: ["☀️"], count: 0, kind: "fall" }, // color-only, no particles
    monsoon: { symbols: ["💧"], count: 18, kind: "fall" },
    default: { symbols: [], count: 0, kind: "fall" }
};

function prefersReducedMotion() {
    return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

function getDecorContainer() {
    let el = document.getElementById(DECOR_CONTAINER_ID);
    if (!el) {
        el = document.createElement("div");
        el.id = DECOR_CONTAINER_ID;
        el.className = "seasonal-decor";
        el.setAttribute("aria-hidden", "true");
        document.body.appendChild(el);
    }
    return el;
}

function renderDecorations(theme) {
    const container = getDecorContainer();
    container.innerHTML = "";

    // Respect reduced-motion: keep the color theme, skip the particles.
    if (prefersReducedMotion()) {
        return;
    }

    const config = DECOR_MAP[theme] || DECOR_MAP.default;
    if (!config.count || !config.symbols.length) {
        return;
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < config.count; i++) {
        const item = document.createElement("span");
        const symbol =
            config.symbols[Math.floor(Math.random() * config.symbols.length)];

        item.className = "decor-item decor-" + config.kind;
        item.textContent = symbol;

        // Randomized placement/timing, kept cheap (inline style only).
        const left = Math.random() * 100;
        const duration = 8 + Math.random() * 10; // seconds
        const delay = Math.random() * 10; // seconds
        const drift = (Math.random() * 60 - 30) + "px";
        const size = 0.9 + Math.random() * 0.9; // em multiplier

        item.style.left = left + "%";
        item.style.animationDuration = duration + "s";
        item.style.animationDelay = "-" + delay + "s";
        item.style.setProperty("--drift", drift);
        item.style.fontSize = size + "em";

        if (config.kind === "glow" || config.kind === "twinkle") {
            item.style.bottom = 2 + Math.random() * 20 + "%";
        }

        fragment.appendChild(item);
    }

    container.appendChild(fragment);
}

// -------------------------------------------
// 7. APPLY / CLEAR
// -------------------------------------------

function applyTheme(theme) {
    if (VALID_THEMES.indexOf(theme) === -1) {
        theme = "default";
    }
    document.body.dataset.theme = theme;
    renderDecorations(theme);
}

function clearTheme() {
    delete document.body.dataset.theme;
    const container = document.getElementById(DECOR_CONTAINER_ID);
    if (container) {
        container.innerHTML = "";
    }
}

// -------------------------------------------
// 8. PREVIEW OVERRIDE (?theme=xyz)
// -------------------------------------------

function getPreviewThemeFromURL() {
    try {
        const params = new URLSearchParams(window.location.search);
        const requested = params.get("theme");
        if (requested && VALID_THEMES.indexOf(requested) !== -1) {
            return requested;
        }
    } catch (e) {
        // URLSearchParams unsupported / malformed URL — ignore, fall
        // through to automatic detection.
    }
    return null;
}

// -------------------------------------------
// 9. INIT
// -------------------------------------------

function initializeSeasonalTheme() {
    const preview = getPreviewThemeFromURL();

    if (preview) {
        applyTheme(preview);
        console.info(
            "[Learnio Seasonal Theme] Preview mode active: \"" +
                preview +
                "\". Remove ?theme= from the URL to return to automatic detection."
        );
        return;
    }

    try {
        const theme = detectSeasonalTheme(new Date());
        applyTheme(theme);
    } catch (err) {
        // Never let a bad date/config break the page — fall back safely.
        console.error("[Learnio Seasonal Theme] Detection failed, using default.", err);
        applyTheme("default");
    }
}

// Re-render decorations (without changing the chosen theme) if the
// user's reduced-motion preference changes mid-session.
if (window.matchMedia) {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = function () {
        renderDecorations(document.body.dataset.theme || "default");
    };
    if (motionQuery.addEventListener) {
        motionQuery.addEventListener("change", handleMotionChange);
    } else if (motionQuery.addListener) {
        motionQuery.addListener(handleMotionChange); // older Safari
    }
}

// -------------------------------------------
// 10. DEV/CONSOLE HELPERS (spec item #19)
// -------------------------------------------
// Usable from the browser console without touching the URL:
//   setSeasonalTheme("christmas")
//   clearSeasonalTheme()
window.setSeasonalTheme = applyTheme;
window.clearSeasonalTheme = clearTheme;
window.detectSeasonalTheme = detectSeasonalTheme; // handy for testing specific dates

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSeasonalTheme);
} else {
    initializeSeasonalTheme();
}

})();
