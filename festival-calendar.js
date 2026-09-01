"use strict";

/* =====================================================================
 * festival-calendar.js
 * ---------------------------------------------------------------------
 * Central festival / occasion calendar for Learnio's dynamic seasonal UI.
 *
 * This file is 100% standalone:
 *   - No external libraries, no APIs, no frameworks.
 *   - Does not touch the DOM.
 *   - Does not modify any other file.
 *   - Meant to be loaded BEFORE seasonal-theme.js (e.g. via a <script>
 *     tag), so that seasonal-theme.js can call the functions exposed
 *     at the bottom of this file to decide which theme to apply.
 *
 * Festivals/occasions always take priority over the 4 base seasons
 * (Summer, Monsoon, Autumn, Winter). seasonal-theme.js is expected to:
 *   1. Call getCurrentFestival() (or getFestivalForDate(date)).
 *   2. If it returns a festival object -> apply festival theme.
 *   3. If it returns null -> fall back to normal seasonal logic.
 *
 * DATA ACCURACY NOTE:
 * Fixed-date occasions (New Year, Republic Day, Independence Day,
 * Christmas, etc.) repeat on the same Gregorian date every year and
 * are reliable.
 *
 * Movable festivals (Diwali, Holi, Eid, Durga Puja, etc.) follow the
 * lunar/lunisolar Hindu calendar or the Islamic Hijri calendar, so
 * their Gregorian dates shift every year and were looked up
 * individually for 2026 and 2027. Entries whose exact date depends on
 * local moon-sighting or regional Panchang variation are explicitly
 * flagged with a "// Verify date before production" comment and a
 * best-available estimate — treat those as provisional.
 * ===================================================================== */

const FESTIVAL_CALENDAR = {

    /* ================================================================
     * YEAR 2026
     * ================================================================ */
    2026: {

        // ---------- National / important days (fixed dates) ----------
        "01-01": { name: "New Year", theme: "newyear", category: "global", priority: 60, description: "Start of the Gregorian calendar year." },
        "01-26": { name: "Republic Day", theme: "republic-day", category: "national", priority: 90, description: "Commemorates the adoption of India's Constitution." },
        "08-15": { name: "Independence Day", theme: "independence", category: "national", priority: 100, description: "Commemorates India's independence in 1947." },
        "09-05": { name: "Teachers' Day", theme: "teachers-day", category: "educational", priority: 70, description: "Honours teachers; birthday of Dr. Sarvepalli Radhakrishnan." },
        "10-02": { name: "Gandhi Jayanti", theme: "gandhi-jayanti", category: "national", priority: 90, description: "Birthday of Mahatma Gandhi." },
        "11-14": { name: "Children's Day", theme: "children-day", category: "national", priority: 70, description: "Birthday of Jawaharlal Nehru; celebrates children." },

        // ---------- Global / fun / educational occasions (fixed dates) ----------
        "02-14": { name: "Valentine's Day", theme: "valentine", category: "global", priority: 40, description: "Celebration of love and friendship." },
        "03-08": { name: "International Women's Day", theme: "womens-day", category: "global", priority: 50, description: "Celebrates achievements of women worldwide." },
        "04-22": { name: "Earth Day", theme: "earth-day", category: "educational", priority: 60, description: "Raises awareness for environmental protection." },
        "06-01": { name: "International Children's Day", theme: "childrens-day-global", category: "global", priority: 50, description: "Global observance celebrating children." },
        "06-05": { name: "World Environment Day", theme: "environment-day", category: "educational", priority: 60, description: "UN day promoting environmental awareness." },
        "10-31": { name: "Halloween", theme: "halloween", category: "global", priority: 40, description: "Costumes, pumpkins, and trick-or-treating." },

        // ---------- Solar / fixed-date Hindu & regional festivals ----------
        "01-14": { name: "Makar Sankranti", theme: "makar-sankranti", category: "indian", priority: 70, description: "Marks the sun's transit into Capricorn; harvest festival." },
        "pongal": { name: "Pongal", theme: "pongal", category: "indian", priority: 70, startDate: "01-14", endDate: "01-17", description: "Tamil 4-day harvest festival." },
        "09-17": { name: "Vishwakarma Puja", theme: "vishwakarma-puja", category: "indian", priority: 60, description: "Worship of Vishwakarma, the divine architect; widely observed in Bengal and eastern India." },

        // ---------- Movable Hindu festivals (2026 dates, Panchang-based) ----------
        "01-23": { name: "Vasant Panchami / Saraswati Puja", theme: "saraswati-puja", category: "indian", priority: 70, description: "Worship of Goddess Saraswati; marks the arrival of spring." },
        "02-15": { name: "Maha Shivratri", theme: "shivratri", category: "indian", priority: 80, description: "Night dedicated to Lord Shiva." },
        "holi": { name: "Holi", theme: "holi", category: "indian", priority: 100, startDate: "03-03", endDate: "03-04", description: "Festival of colours. Holika Dahan on Mar 3, Rangwali Holi on Mar 4." },
        "03-26": { name: "Ram Navami", theme: "ram-navami", category: "indian", priority: 80, description: "Celebrates the birth of Lord Rama." },
        "05-01": { name: "Buddha Purnima", theme: "buddha-purnima", category: "religious", priority: 70, description: "Celebrates the birth of Gautama Buddha." },
        "07-15": { name: "Jagannath Rath Yatra", theme: "rath-yatra", category: "indian", priority: 70, description: "Chariot festival of Lord Jagannath, Puri." },
        "08-26": { name: "Onam (Thiruvonam)", theme: "onam", category: "indian", priority: 80, description: "Kerala's grand harvest festival." },
        "08-28": { name: "Raksha Bandhan", theme: "raksha-bandhan", category: "indian", priority: 80, description: "Celebrates the bond between siblings." },
        "09-04": { name: "Krishna Janmashtami", theme: "janmashtami", category: "indian", priority: 90, description: "Celebrates the birth of Lord Krishna." },
        "09-14": { name: "Ganesh Chaturthi", theme: "ganesh-chaturthi", category: "indian", priority: 90, description: "Celebrates the birth of Lord Ganesha; 10-day festival begins." },

        "navratri": { name: "Sharad Navratri", theme: "navratri", category: "indian", priority: 80, startDate: "10-11", endDate: "10-19", description: "Nine nights honouring Goddess Durga." },
        "durga-puja": { name: "Durga Puja", theme: "durga-puja", category: "bengal", priority: 100, startDate: "10-17", endDate: "10-20", description: "Bengal's grandest festival honouring Goddess Durga. Includes Maha Saptami, Ashtami, Navami; culminates in Vijayadashami." },
        "10-20": { name: "Dussehra / Vijayadashami", theme: "dussehra", category: "indian", priority: 90, description: "Victory of good over evil; Durga's farewell in Bengal, burning of Ravana effigies elsewhere." },

        "diwali": { name: "Diwali", theme: "diwali", category: "indian", priority: 100, startDate: "11-06", endDate: "11-08", description: "Festival of Lights. Dhanteras Nov 6, Lakshmi Puja / main Diwali day Nov 8." },
        "11-08": { name: "Kali Puja", theme: "kali-puja", category: "bengal", priority: 90, description: "Bengal's worship of Goddess Kali, observed on the same night as Diwali/Lakshmi Puja." },
        // Jagaddhatri Puja falls roughly a week after Kali Puja; exact Panchang date not confidently verified.
        // Verify date before production
        "11-15": { name: "Jagaddhatri Puja", theme: "jagaddhatri-puja", category: "bengal", priority: 60, description: "Bengal festival honouring Goddess Jagaddhatri, observed shortly after Kali Puja." },
        "11-24": { name: "Guru Nanak Jayanti", theme: "guru-nanak-jayanti", category: "religious", priority: 80, description: "Birthday of Guru Nanak, founder of Sikhism." },

        // ---------- Islamic festivals (2026 — approximate, subject to moon sighting) ----------
        // Verify date before production
        "03-20": { name: "Eid al-Fitr", theme: "eid", category: "religious", priority: 100, description: "Marks the end of Ramadan. Date depends on moon sighting; may shift by a day." },
        // Verify date before production
        "05-27": { name: "Eid al-Adha", theme: "eid-al-adha", category: "religious", priority: 100, description: "Festival of Sacrifice. Date depends on moon sighting; may shift by a day." },
        // Verify date before production
        "06-17": { name: "Muharram", theme: "muharram", category: "religious", priority: 70, description: "Islamic New Year / start of the month of Muharram." },

        // ---------- Christian festivals ----------
        "04-03": { name: "Good Friday", theme: "good-friday", category: "religious", priority: 80, description: "Commemorates the crucifixion of Jesus Christ." },
        "04-05": { name: "Easter", theme: "easter", category: "religious", priority: 80, description: "Celebrates the resurrection of Jesus Christ." },
        "12-25": { name: "Christmas", theme: "christmas", category: "religious", priority: 100, description: "Celebrates the birth of Jesus Christ." }
    },

    /* ================================================================
     * YEAR 2027
     * ================================================================ */
    2027: {

        // ---------- National / important days (fixed dates) ----------
        "01-01": { name: "New Year", theme: "newyear", category: "global", priority: 60, description: "Start of the Gregorian calendar year." },
        "01-26": { name: "Republic Day", theme: "republic-day", category: "national", priority: 90, description: "Commemorates the adoption of India's Constitution." },
        "08-15": { name: "Independence Day", theme: "independence", category: "national", priority: 100, description: "Commemorates India's independence in 1947." },
        "09-05": { name: "Teachers' Day", theme: "teachers-day", category: "educational", priority: 70, description: "Honours teachers; birthday of Dr. Sarvepalli Radhakrishnan." },
        "10-02": { name: "Gandhi Jayanti", theme: "gandhi-jayanti", category: "national", priority: 90, description: "Birthday of Mahatma Gandhi." },
        "11-14": { name: "Children's Day", theme: "children-day", category: "national", priority: 70, description: "Birthday of Jawaharlal Nehru; celebrates children." },

        // ---------- Global / fun / educational occasions (fixed dates) ----------
        "02-14": { name: "Valentine's Day", theme: "valentine", category: "global", priority: 40, description: "Celebration of love and friendship." },
        "03-08": { name: "International Women's Day", theme: "womens-day", category: "global", priority: 50, description: "Celebrates achievements of women worldwide." },
        "04-22": { name: "Earth Day", theme: "earth-day", category: "educational", priority: 60, description: "Raises awareness for environmental protection." },
        "06-01": { name: "International Children's Day", theme: "childrens-day-global", category: "global", priority: 50, description: "Global observance celebrating children." },
        "06-05": { name: "World Environment Day", theme: "environment-day", category: "educational", priority: 60, description: "UN day promoting environmental awareness." },
        "10-31": { name: "Halloween", theme: "halloween", category: "global", priority: 40, description: "Costumes, pumpkins, and trick-or-treating." },

        // ---------- Solar / fixed-date Hindu & regional festivals ----------
        "01-14": { name: "Makar Sankranti", theme: "makar-sankranti", category: "indian", priority: 70, description: "Marks the sun's transit into Capricorn; harvest festival." },
        "pongal": { name: "Pongal", theme: "pongal", category: "indian", priority: 70, startDate: "01-14", endDate: "01-17", description: "Tamil 4-day harvest festival." },
        "09-17": { name: "Vishwakarma Puja", theme: "vishwakarma-puja", category: "indian", priority: 60, description: "Worship of Vishwakarma, the divine architect; widely observed in Bengal and eastern India." },

        // ---------- Movable Hindu festivals (2027 dates, Panchang-based) ----------
        "02-11": { name: "Vasant Panchami / Saraswati Puja", theme: "saraswati-puja", category: "indian", priority: 70, description: "Worship of Goddess Saraswati; marks the arrival of spring." },
        "03-06": { name: "Maha Shivratri", theme: "shivratri", category: "indian", priority: 80, description: "Night dedicated to Lord Shiva." },
        "holi": { name: "Holi", theme: "holi", category: "indian", priority: 100, startDate: "03-21", endDate: "03-22", description: "Festival of colours. Holika Dahan on Mar 21, Rangwali Holi on Mar 22." },
        "04-15": { name: "Ram Navami", theme: "ram-navami", category: "indian", priority: 80, description: "Celebrates the birth of Lord Rama." },
        // Verify date before production
        "05-20": { name: "Buddha Purnima", theme: "buddha-purnima", category: "religious", priority: 70, description: "Celebrates the birth of Gautama Buddha. Approximate — verify against Panchang." },
        // Verify date before production
        "07-04": { name: "Jagannath Rath Yatra", theme: "rath-yatra", category: "indian", priority: 70, description: "Chariot festival of Lord Jagannath, Puri. Approximate — verify against Panchang." },
        // Verify date before production
        "09-14": { name: "Onam (Thiruvonam)", theme: "onam", category: "indian", priority: 80, description: "Kerala's grand harvest festival. Approximate — verify against Malayalam calendar." },
        "08-17": { name: "Raksha Bandhan", theme: "raksha-bandhan", category: "indian", priority: 80, description: "Celebrates the bond between siblings." },
        "08-25": { name: "Krishna Janmashtami", theme: "janmashtami", category: "indian", priority: 90, description: "Celebrates the birth of Lord Krishna." },
        "09-04": { name: "Ganesh Chaturthi", theme: "ganesh-chaturthi", category: "indian", priority: 90, description: "Celebrates the birth of Lord Ganesha; 10-day festival begins." },

        // Verify date before production
        "navratri": { name: "Sharad Navratri", theme: "navratri", category: "indian", priority: 80, startDate: "09-30", endDate: "10-08", description: "Nine nights honouring Goddess Durga. Approximate — verify against Panchang." },
        // Verify date before production
        "durga-puja": { name: "Durga Puja", theme: "durga-puja", category: "bengal", priority: 100, startDate: "10-05", endDate: "10-09", description: "Bengal's grandest festival honouring Goddess Durga. Approximate — verify Saptami/Ashtami/Navami dates against Panchang." },
        "10-09": { name: "Dussehra / Vijayadashami", theme: "dussehra", category: "indian", priority: 90, description: "Victory of good over evil; Durga's farewell in Bengal, burning of Ravana effigies elsewhere." },

        "diwali": { name: "Diwali", theme: "diwali", category: "indian", priority: 100, startDate: "10-27", endDate: "10-29", description: "Festival of Lights. Dhanteras ~Oct 27, Lakshmi Puja / main Diwali day Oct 29." },
        "10-29": { name: "Kali Puja", theme: "kali-puja", category: "bengal", priority: 90, description: "Bengal's worship of Goddess Kali, observed on the same night as Diwali/Lakshmi Puja." },
        // Verify date before production
        "11-05": { name: "Jagaddhatri Puja", theme: "jagaddhatri-puja", category: "bengal", priority: 60, description: "Bengal festival honouring Goddess Jagaddhatri, observed shortly after Kali Puja. Approximate — verify against Panchang." },
        // Verify date before production
        "11-13": { name: "Guru Nanak Jayanti", theme: "guru-nanak-jayanti", category: "religious", priority: 80, description: "Birthday of Guru Nanak, founder of Sikhism. Approximate — verify against Panchang." },

        // ---------- Islamic festivals (2027 — approximate, subject to moon sighting) ----------
        // Verify date before production
        "03-09": { name: "Eid al-Fitr", theme: "eid", category: "religious", priority: 100, description: "Marks the end of Ramadan. Date depends on moon sighting; may shift by a day or two." },
        // Verify date before production
        "05-16": { name: "Eid al-Adha", theme: "eid-al-adha", category: "religious", priority: 100, description: "Festival of Sacrifice. Approximate — depends on moon sighting." },
        // Verify date before production
        "06-06": { name: "Muharram", theme: "muharram", category: "religious", priority: 70, description: "Islamic New Year / start of the month of Muharram. Approximate — depends on moon sighting." },

        // ---------- Christian festivals ----------
        "03-26": { name: "Good Friday", theme: "good-friday", category: "religious", priority: 80, description: "Commemorates the crucifixion of Jesus Christ." },
        "03-28": { name: "Easter", theme: "easter", category: "religious", priority: 80, description: "Celebrates the resurrection of Jesus Christ." },
        "12-25": { name: "Christmas", theme: "christmas", category: "religious", priority: 100, description: "Celebrates the birth of Jesus Christ." }
    }
};

/* =====================================================================
 * INTERNAL HELPERS (not exposed globally)
 * ===================================================================== */

/**
 * Zero-pads a number to 2 digits, e.g. 5 -> "05".
 * @param {number} n
 * @returns {string}
 */
function _pad2(n) {
    return String(n).padStart(2, "0");
}

/**
 * Converts a JS Date object into an "MM-DD" string.
 * @param {Date} date
 * @returns {string}
 */
function _toMonthDay(date) {
    return _pad2(date.getMonth() + 1) + "-" + _pad2(date.getDate());
}

/**
 * Converts an "MM-DD" string into a comparable integer (MMDD),
 * e.g. "11-08" -> 1108. Used for simple range comparisons within
 * the same calendar year (no year-wraparound support needed here).
 * @param {string} monthDay
 * @returns {number}
 */
function _toComparable(monthDay) {
    const parts = monthDay.split("-");
    return parseInt(parts[0], 10) * 100 + parseInt(parts[1], 10);
}

/**
 * Checks whether an "MM-DD" value falls within a festival entry's
 * date range (handles both single-day entries keyed by "MM-DD" and
 * multi-day entries that carry startDate/endDate fields).
 * @param {string} monthDay - The date being checked, as "MM-DD".
 * @param {string} entryKey - The key this entry is stored under.
 * @param {object} entry - The festival/occasion entry.
 * @returns {boolean}
 */
function _entryMatchesDate(monthDay, entryKey, entry) {
    if (entry.startDate && entry.endDate) {
        const target = _toComparable(monthDay);
        const start = _toComparable(entry.startDate);
        const end = _toComparable(entry.endDate);
        return target >= start && target <= end;
    }

    // Single-day entry: the object key itself is the "MM-DD" date,
    // unless the entry explicitly provides its own "date" field.
    const singleDate = entry.date || entryKey;
    return singleDate === monthDay;
}

/* =====================================================================
 * PUBLIC API
 * ===================================================================== */

/**
 * Returns the highest-priority festival/occasion matching the given
 * JavaScript Date object, or null if there is no match.
 * If multiple occasions overlap on the same date, the one with the
 * highest "priority" value wins (default priority is 50 when unset).
 *
 * @param {Date} date
 * @returns {object|null} A copy of the matching festival entry
 *                         (with "year" and "key" added), or null.
 */
function getFestivalForDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return null;
    }

    const year = date.getFullYear();
    const yearData = FESTIVAL_CALENDAR[year];
    if (!yearData) {
        return null;
    }

    const monthDay = _toMonthDay(date);
    let best = null;

    for (const key in yearData) {
        if (!Object.prototype.hasOwnProperty.call(yearData, key)) {
            continue;
        }
        const entry = yearData[key];
        if (!_entryMatchesDate(monthDay, key, entry)) {
            continue;
        }

        const priority = typeof entry.priority === "number" ? entry.priority : 50;
        if (!best || priority > best.priority) {
            best = Object.assign({}, entry, { priority: priority, year: year, key: key });
        }
    }

    return best;
}

/**
 * Returns all festivals/occasions defined for a given year.
 * Safely returns an empty object if the year is not present.
 *
 * @param {number} year
 * @returns {object}
 */
function getFestivalsForYear(year) {
    return FESTIVAL_CALENDAR[year] ? Object.assign({}, FESTIVAL_CALENDAR[year]) : {};
}

/**
 * Returns true if the given date has a matching festival/occasion.
 *
 * @param {Date} date
 * @returns {boolean}
 */
function isFestivalDate(date) {
    return getFestivalForDate(date) !== null;
}

/**
 * Returns today's festival/occasion, or null if there is none.
 *
 * @returns {object|null}
 */
function getCurrentFestival() {
    return getFestivalForDate(new Date());
}

/**
 * Returns the next upcoming festival/occasion strictly after today,
 * searching the current year first and then the next year defined
 * in FESTIVAL_CALENDAR. Returns null if none is found.
 *
 * For multi-day festivals, the startDate is used as the reference
 * date for comparison/sorting.
 *
 * @returns {object|null}
 */
function getUpcomingFestival() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayYear = today.getFullYear();

    // Collect candidate years present in the calendar, from this
    // year onward, sorted ascending.
    const candidateYears = Object.keys(FESTIVAL_CALENDAR)
        .map(Number)
        .filter((y) => y >= todayYear)
        .sort((a, b) => a - b);

    let upcoming = null;

    candidateYears.forEach((year) => {
        const yearData = FESTIVAL_CALENDAR[year];
        for (const key in yearData) {
            if (!Object.prototype.hasOwnProperty.call(yearData, key)) {
                continue;
            }
            const entry = yearData[key];
            const monthDay = entry.startDate || entry.date || key;
            const parts = monthDay.split("-");
            const entryDate = new Date(year, parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));

            if (entryDate <= today) {
                continue; // only strictly future occasions
            }

            if (!upcoming || entryDate < upcoming._sortDate) {
                upcoming = Object.assign({}, entry, {
                    year: year,
                    key: key,
                    priority: typeof entry.priority === "number" ? entry.priority : 50,
                    _sortDate: entryDate
                });
            }
        }
    });

    if (upcoming) {
        delete upcoming._sortDate;
    }

    return upcoming;
}

/* =====================================================================
 * GLOBAL EXPORTS
 * Only these six identifiers are exposed globally, as required by
 * seasonal-theme.js and any other future consumer.
 * ===================================================================== */
window.FESTIVAL_CALENDAR = FESTIVAL_CALENDAR;
window.getFestivalForDate = getFestivalForDate;
window.getFestivalsForYear = getFestivalsForYear;
window.isFestivalDate = isFestivalDate;
window.getCurrentFestival = getCurrentFestival;
window.getUpcomingFestival = getUpcomingFestival;
