document.addEventListener('DOMContentLoaded', () => {
    // --- Global Element References ---
    const dailyDevotionalButton = document.getElementById('dailyDevotionalButton');
    const answerDisplay = document.getElementById('answerDisplay'); // This is our main display area
    const questionInput = document.getElementById('questionInput'); // For the main Bible search input
    const searchButton = document.getElementById('searchButton'); // For the main Bible search button
    const darkModeToggle = document.getElementById('darkModeToggle');
    const decreaseFont = document.getElementById('decreaseFont');
    const increaseFont = document.getElementById('increaseFont');
    const appTitle = document.querySelector('.top-bar h1'); // Reference to the H1 title

    // Devotional Date Selectors (from the HTML you added)
    const monthSelect = document.getElementById('monthSelect');
    const daySelect = document.getElementById('daySelect');
    const yearDisplay = document.getElementById('yearDisplay');

    // Navigation/Share buttons (using the 'Top' IDs from your HTML for consistency)
    const prevChapterTop = document.getElementById('prevChapterTop');
    const nextChapterTop = document.getElementById('nextChapterTop');
    const copySelectedTop = document.getElementById('copySelectedTop');
    const shareSelectedTop = document.getElementById('shareSelectedTop');
    const shareOptionsTop = document.getElementById('shareOptionsTop'); // The share options div

    // Lower Navigation/Share buttons (if you intend to use them, ensure their IDs are correctly referenced here)
    const copySelected = document.getElementById('copySelected');
    const shareSelected = document.getElementById('shareSelected');
    const prevChapter = document.getElementById('prevChapter');
    const nextChapter = document.getElementById('nextChapter');
    const shareOptions = document.getElementById('shareOptions');


    // NEW: Elements to toggle visibility based on app mode
    const bibleControlElements = [
        document.getElementById('combinedPill'), // Book/Chapter/Version selectors
        document.querySelector('.search-container'), // The div containing questionInput and searchButton
        // You can add more Bible-specific elements here if they need to hide/show
    ].filter(Boolean); // Filter out any null elements if IDs are missing in HTML

    const devotionalControlElements = [
        document.getElementById('datePill'), // Month/Day/Year selectors
    ].filter(Boolean);


    // --- BIBLE BOOK DATA ---
    const bibleBooks = [
        { name: "Genesis", chapters: 50, abbr: ["gen"] }, { name: "Exodus", chapters: 40, abbr: ["ex"] },
        { name: "Leviticus", chapters: 27, abbr: ["lev"] }, { name: "Numbers", chapters: 36, abbr: ["num"] },
        { name: "Deuteronomy", chapters: 34, abbr: ["deut"] }, { name: "Joshua", chapters: 24, abbr: ["josh"] },
        { name: "Judges", chapters: 21, abbr: ["judg"] }, { name: "Ruth", chapters: 4, abbr: ["rth"] },
        { name: "1 Samuel", chapters: 31, abbr: ["1sam"] }, { name: "2 Samuel", chapters: 24, abbr: ["2sam"] },
        { name: "1 Kings", chapters: 22, abbr: ["1kgs"] }, { name: "2 Kings", chapters: 25, abbr: ["2kgs"] },
        { name: "1 Chronicles", chapters: 29, abbr: ["1chr"] }, { name: "2 Chronicles", chapters: 36, abbr: ["2chr"] },
        { name: "Ezra", chapters: 10, abbr: ["ezra"] }, { name: "Nehemiah", chapters: 13, abbr: ["neh"] },
        { name: "Esther", chapters: 10, abbr: ["est"] }, { name: "Job", chapters: 42, abbr: ["job"] },
        { name: "Psalms", chapters: 150, abbr: ["ps", "psalm"] }, { name: "Proverbs", chapters: 31, abbr: ["prov"] },
        { name: "Ecclesiastes", chapters: 12, abbr: ["eccl"] }, { name: "Song of Solomon", chapters: 8, abbr: ["song"] },
        { name: "Isaiah", chapters: 66, abbr: ["isa"] }, { name: "Jeremiah", chapters: 52, abbr: ["jer"] },
        { name: "Lamentations", chapters: 5, abbr: ["lam"] }, { name: "Ezekiel", chapters: 48, abbr: ["ezek"] },
        { name: "Daniel", chapters: 12, abbr: ["dan"] }, { name: "Hosea", chapters: 14, abbr: ["hos"] },
        { name: "Joel", chapters: 3, abbr: ["joel"] }, { name: "Amos", chapters: 9, abbr: ["amo"] },
        { name: "Obadiah", chapters: 1, abbr: ["ob"] }, { name: "Jonah", chapters: 4, abbr: ["jon"] },
        { name: "Micah", chapters: 7, abbr: ["mic"] }, { name: "Nahum
