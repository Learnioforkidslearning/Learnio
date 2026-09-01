// ================================================================
// LEARNIO DYNAMIC SEASONAL + FESTIVAL THEME ENGINE
// ================================================================
//
// 4 SEASONS:
// ☀️ Summer
// 🌧️ Monsoon
// 🍂 Autumn
// ❄️ Winter
//
// FESTIVALS HAVE HIGHER PRIORITY THAN SEASONS.
//
// Example:
// December 25
// → Winter season
// → Christmas detected
// → Christmas theme applied
//
// This file works with:
//     festival-calendar.js
//
// IMPORTANT:
// festival-calendar.js MUST load BEFORE this file.
//
// ================================================================

(function () {

    "use strict";


    // ============================================================
    // 1. VALID THEME IDs
    // ============================================================

    const VALID_THEMES = [

        // Base seasons
        "summer",
        "monsoon",
        "autumn",
        "winter",

        // Festivals / occasions
        "newyear",
        "new-year",

        "republic-day",

        "valentine",

        "womens-day",

        "earth-day",

        "environment-day",

        "childrens-day-global",

        "children-day",

        "teachers-day",

        "gandhi-jayanti",

        "independence",
        "independence-day",

        "poila-boishakh",

        "makar-sankranti",

        "pongal",

        "saraswati-puja",

        "shivratri",

        "holi",

        "ram-navami",

        "buddha-purnima",

        "rath-yatra",

        "onam",

        "raksha-bandhan",

        "janmashtami",

        "ganesh-chaturthi",

        "navratri",

        "durga-puja",

        "dussehra",

        "diwali",

        "kali-puja",

        "jagaddhatri-puja",

        "guru-nanak-jayanti",

        "eid",

        "eid-al-adha",

        "muharram",

        "good-friday",

        "easter",

        "christmas",

        "halloween",

        "default"
    ];


    // ============================================================
    // 2. FOUR SEASONS
    // ============================================================

    const SEASONS = {

        summer: {
            name: "Summer",
            months: [3, 4, 5]
        },

        monsoon: {
            name: "Monsoon",
            months: [6, 7, 8, 9]
        },

        autumn: {
            name: "Autumn",
            months: [10, 11]
        },

        winter: {
            name: "Winter",
            months: [12, 1, 2]
        }

    };


    // ============================================================
    // 3. GET SEASON FROM DATE
    // ============================================================

    function getCurrentSeason(date) {

        if (!(date instanceof Date) || isNaN(date.getTime())) {
            date = new Date();
        }

        const month = date.getMonth() + 1;

        for (const seasonId in SEASONS) {

            if (
                SEASONS[seasonId].months.includes(month)
            ) {
                return seasonId;
            }

        }

        // Safe fallback
        return "winter";
    }


    // ============================================================
    // 4. GET FESTIVAL SAFELY
    // ============================================================

    function getFestivalSafely(date) {

        /*
         * festival-calendar.js should already provide:
         *
         * getFestivalForDate(date)
         */

        if (
            typeof window.getFestivalForDate === "function"
        ) {

            try {

                return window.getFestivalForDate(date);

            } catch (error) {

                console.error(
                    "[Learnio Seasonal Theme] Festival calendar error:",
                    error
                );

                return null;
            }
        }

        console.warn(
            "[Learnio Seasonal Theme] festival-calendar.js was not loaded."
        );

        return null;
    }


    // ============================================================
    // 5. DETERMINE THEME
    // ============================================================

    function detectTheme(date) {

        if (!(date instanceof Date) || isNaN(date.getTime())) {
            date = new Date();
        }


        // --------------------------------------------------------
        // FESTIVAL ALWAYS GETS PRIORITY
        // --------------------------------------------------------

        const festival = getFestivalSafely(date);


        if (
            festival &&
            festival.theme
        ) {

            return {

                theme: festival.theme,

                season: getCurrentSeason(date),

                occasion: festival.name || "",

                festival: festival,

                isFestival: true

            };

        }


        // --------------------------------------------------------
        // NO FESTIVAL → USE SEASON
        // --------------------------------------------------------

        const season = getCurrentSeason(date);

        return {

            theme: season,

            season: season,

            occasion: "",

            festival: null,

            isFestival: false

        };

    }


    // ============================================================
    // 6. DECORATION CONFIGURATION
    // ============================================================

    const DECOR_MAP = {

        // --------------------------------------------------------
        // SUMMER
        // --------------------------------------------------------

        summer: {
            symbols: ["☀️", "✨"],
            count: 8,
            kind: "float"
        },


        // --------------------------------------------------------
        // MONSOON
        // --------------------------------------------------------

        monsoon: {
            symbols: ["💧", "🌧️"],
            count: 18,
            kind: "rain"
        },


        // --------------------------------------------------------
        // AUTUMN
        // --------------------------------------------------------

        autumn: {
            symbols: ["🍂", "🍁"],
            count: 14,
            kind: "fall"
        },


        // --------------------------------------------------------
        // WINTER
        // --------------------------------------------------------

        winter: {
            symbols: ["❄️", "❄"],
            count: 18,
            kind: "snow"
        },


        // --------------------------------------------------------
        // FESTIVALS
        // --------------------------------------------------------

        christmas: {
            symbols: ["❄️", "✨", "⭐"],
            count: 18,
            kind: "snow"
        },

        diwali: {
            symbols: ["🪔", "✨"],
            count: 16,
            kind: "glow"
        },

        "kali-puja": {
            symbols: ["🪔", "✨"],
            count: 14,
            kind: "glow"
        },

        "durga-puja": {
            symbols: ["🌸", "🪔", "✨"],
            count: 14,
            kind: "glow"
        },

        holi: {
            symbols: ["🎨", "🌈", "✨"],
            count: 18,
            kind: "color"
        },

        "poila-boishakh": {
            symbols: ["🌸", "🌺", "✨"],
            count: 12,
            kind: "float"
        },

        "saraswati-puja": {
            symbols: ["🌼", "📚", "✨"],
            count: 12,
            kind: "float"
        },

        "republic-day": {
            symbols: ["🪁", "✨"],
            count: 10,
            kind: "float"
        },

        independence: {
            symbols: ["🪁", "✨"],
            count: 10,
            kind: "float"
        },

        "independence-day": {
            symbols: ["🪁", "✨"],
            count: 10,
            kind: "float"
        },

        "newyear": {
            symbols: ["🎉", "🎊", "✨"],
            count: 16,
            kind: "float"
        },

        "new-year": {
            symbols: ["🎉", "🎊", "✨"],
            count: 16,
            kind: "float"
        },

        valentine: {
            symbols: ["💖", "✨"],
            count: 10,
            kind: "float"
        },

        "raksha-bandhan": {
            symbols: ["🎀", "✨"],
            count: 10,
            kind: "float"
        },

        janmashtami: {
            symbols: ["🪷", "✨"],
            count: 12,
            kind: "float"
        },

        "ganesh-chaturthi": {
            symbols: ["🌺", "✨"],
            count: 12,
            kind: "float"
        },

        navratri: {
            symbols: ["🌺", "✨"],
            count: 12,
            kind: "float"
        },

        dussehra: {
            symbols: ["✨", "🌸"],
            count: 10,
            kind: "float"
        },

        eid: {
            symbols: ["🌙", "✨"],
            count: 12,
            kind: "float"
        },

        "eid-al-adha": {
            symbols: ["🌙", "✨"],
            count: 12,
            kind: "float"
        },

        easter: {
            symbols: ["🌸", "🥚", "✨"],
            count: 12,
            kind: "float"
        },

        halloween: {
            symbols: ["🎃", "✨"],
            count: 12,
            kind: "float"
        },

        "children-day-global": {
            symbols: ["🎈", "⭐", "✨"],
            count: 12,
            kind: "float"
        },

        "children-day": {
            symbols: ["🎈", "⭐", "✨"],
            count: 12,
            kind: "float"
        },

        "teachers-day": {
            symbols: ["📚", "⭐", "✨"],
            count: 10,
            kind: "float"
        },

        default: {
            symbols: [],
            count: 0,
            kind: "float"
        }

    };


    // ============================================================
    // 7. REDUCED MOTION CHECK
    // ============================================================

    function prefersReducedMotion() {

        return (
            window.matchMedia &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        );

    }


    // ============================================================
    // 8. DECORATION CONTAINER
    // ============================================================

    const DECOR_CONTAINER_ID = "seasonal-decor";


    function getDecorContainer() {

        let container =
            document.getElementById(
                DECOR_CONTAINER_ID
            );


        if (!container) {

            container =
                document.createElement("div");

            container.id =
                DECOR_CONTAINER_ID;

            container.className =
                "seasonal-decor";

            container.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.appendChild(
                container
            );

        }


        return container;

    }


    // ============================================================
    // 9. RENDER DECORATIONS
    // ============================================================

    function renderDecorations(theme) {

        const container =
            getDecorContainer();


        container.innerHTML = "";


        // Respect accessibility settings
        if (prefersReducedMotion()) {
            return;
        }


        const config =
            DECOR_MAP[theme] ||
            DECOR_MAP.default;


        if (
            !config.count ||
            !config.symbols.length
        ) {

            return;

        }


        const fragment =
            document.createDocumentFragment();


        for (
            let i = 0;
            i < config.count;
            i++
        ) {

            const item =
                document.createElement("span");


            const symbol =
                config.symbols[
                    Math.floor(
                        Math.random() *
                        config.symbols.length
                    )
                ];


            item.className =
                "decor-item decor-" +
                config.kind;


            item.textContent =
                symbol;


            // Random position
            item.style.left =
                Math.random() * 100 +
                "%";


            // Random animation duration
            item.style.animationDuration =
                7 +
                Math.random() * 10 +
                "s";


            // Random animation delay
            item.style.animationDelay =
                "-" +
                Math.random() * 10 +
                "s";


            // Random horizontal movement
            item.style.setProperty(
                "--drift",
                (Math.random() * 80 - 40) +
                "px"
            );


            // Random size
            item.style.fontSize =
                0.8 +
                Math.random() * 0.8 +
                "rem";


            fragment.appendChild(item);

        }


        container.appendChild(
            fragment
        );

    }


    // ============================================================
    // 10. APPLY THEME
    // ============================================================

    function applyTheme(themeData) {

        if (!themeData) {
            themeData = detectTheme(new Date());
        }


        let theme =
            themeData.theme || "default";


        // Safety check
        if (
            !VALID_THEMES.includes(theme)
        ) {

            theme = "default";

        }


        // Apply theme
        document.body.dataset.theme =
            theme;


        // Apply season separately
        document.body.dataset.season =
            themeData.season || "";


        // Apply occasion
        document.body.dataset.occasion =
            themeData.occasion || "";


        // Festival flag
        document.body.dataset.festival =
            themeData.isFestival
                ? "true"
                : "false";


        // Render visual decorations
        renderDecorations(theme);


        // Development logging
        console.info(
            "[Learnio Theme]",
            theme
        );

        console.info(
            "[Learnio Season]",
            themeData.season
        );


        if (themeData.occasion) {

            console.info(
                "[Learnio Occasion]",
                themeData.occasion
            );

        }

    }


    // ============================================================
    // 11. CLEAR THEME
    // ============================================================

    function clearTheme() {

        delete document.body.dataset.theme;

        delete document.body.dataset.season;

        delete document.body.dataset.occasion;

        delete document.body.dataset.festival;


        const container =
            document.getElementById(
                DECOR_CONTAINER_ID
            );


        if (container) {
            container.innerHTML = "";
        }

    }


    // ============================================================
    // 12. URL PREVIEW
    // ============================================================

    function getPreviewThemeFromURL() {

        try {

            const params =
                new URLSearchParams(
                    window.location.search
                );


            const requested =
                params.get("theme");


            if (
                requested &&
                VALID_THEMES.includes(requested)
            ) {

                return requested;

            }

        } catch (error) {

            console.warn(
                "[Learnio Theme] Invalid preview URL."
            );

        }


        return null;

    }


    // ============================================================
    // 13. INITIALIZE
    // ============================================================

    function initializeSeasonalTheme() {

        const preview =
            getPreviewThemeFromURL();


        // --------------------------------------------------------
        // MANUAL URL PREVIEW
        // Example:
        // index.html?theme=christmas
        // --------------------------------------------------------

        if (preview) {

            const season =
                getCurrentSeason(
                    new Date()
                );


            applyTheme({

                theme: preview,

                season: season,

                occasion: "Preview",

                festival: null,

                isFestival: true

            });


            console.info(
                "[Learnio Theme] Preview mode:",
                preview
            );


            return;

        }


        // --------------------------------------------------------
        // AUTOMATIC DAILY DETECTION
        // --------------------------------------------------------

        try {

            const themeData =
                detectTheme(
                    new Date()
                );


            applyTheme(
                themeData
            );


        } catch (error) {

            console.error(
                "[Learnio Theme] Theme detection failed:",
                error
            );


            // Safe fallback
            applyTheme({

                theme: "default",

                season: "winter",

                occasion: "",

                festival: null,

                isFestival: false

            });

        }

    }


    // ============================================================
    // 14. TESTING SYSTEM
    // ============================================================

    /*
     * Test a specific date without changing your computer date.
     *
     * Example in browser console:
     *
     * setLearnioTestDate(2026, 12, 25);
     *
     * → Christmas
     *
     * setLearnioTestDate(2026, 7, 15);
     *
     * → Monsoon
     *
     * setLearnioTestDate(2026, 10, 25);
     *
     * → Autumn / festival depending on calendar
     *
     * NOTE:
     * Month is 1-12, NOT JavaScript's normal 0-11.
     */

    window.setLearnioTestDate =
        function (year, month, day) {

            const testDate =
                new Date(
                    year,
                    month - 1,
                    day
                );


            if (
                isNaN(
                    testDate.getTime()
                )
            ) {

                console.error(
                    "[Learnio Theme] Invalid test date."
                );

                return;

            }


            const themeData =
                detectTheme(
                    testDate
                );


            applyTheme(
                themeData
            );


            console.info(
                "[Learnio Theme] TEST DATE:",
                testDate.toDateString()
            );

        };


    // ============================================================
    // 15. RESET TO REAL DATE
    // ============================================================

    window.resetLearnioTheme =
        function () {

            applyTheme(
                detectTheme(
                    new Date()
                )
            );


            console.info(
                "[Learnio Theme] Returned to today's real date."
            );

        };


    // ============================================================
    // 16. PUBLIC API
    // ============================================================

    window.LearnioTheme = {

        getCurrentSeason:
            getCurrentSeason,

        detectTheme:
            detectTheme,

        applyTheme:
            function (theme) {

                applyTheme({

                    theme: theme,

                    season:
                        getCurrentSeason(
                            new Date()
                        ),

                    occasion: "Manual Preview",

                    festival: null,

                    isFestival: true

                });

            },

        clearTheme:
            clearTheme,

        renderDecorations:
            renderDecorations

    };


    // Backward-compatible helpers
    window.setSeasonalTheme =
        window.LearnioTheme.applyTheme;

    window.clearSeasonalTheme =
        clearTheme;


    // ============================================================
    // 17. REDUCED MOTION LISTENER
    // ============================================================

    if (window.matchMedia) {

        const motionQuery =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );


        const handleMotionChange =
            function () {

                const currentTheme =
                    document.body.dataset.theme ||
                    "default";


                renderDecorations(
                    currentTheme
                );

            };


        if (
            motionQuery.addEventListener
        ) {

            motionQuery.addEventListener(
                "change",
                handleMotionChange
            );

        } else if (
            motionQuery.addListener
        ) {

            motionQuery.addListener(
                handleMotionChange
            );

        }

    }


    // ============================================================
    // 18. START ENGINE
    // ============================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeSeasonalTheme
        );

    } else {

        initializeSeasonalTheme();

    }


})();