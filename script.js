document.addEventListener('DOMContentLoaded', () => {
    // --- Global Element References ---
    const dailyDevotionalButton = document.getElementById('dailyDevotionalButton');
    const answerDisplay = document.getElementById('answerDisplay'); // This is our main display area
    const questionInput = document.getElementById('questionInput'); // For the main Bible search input
    const searchButton = document.getElementById('searchButton'); // For the main Bible search button
    const darkModeToggle = document.getElementById('darkModeToggle');
    const decreaseFont = document.getElementById('decreaseFont');
    const increaseFont = document('increaseFont'); // Corrected: This should be getElementById
    const appTitle = document.querySelector('.top-bar h1'); // Reference to the H1 title

    // Corrected the line above:
    // const increaseFont = document.getElementById('increaseFont'); // This line was incorrect (missing .getElementById)

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
    ].filter(Boolean);

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
        { name: "Micah", chapters: 7, abbr: ["mic"] }, { name: "Nahum", chapters: 3, abbr: ["nah"] },
        { name: "Habakkuk", chapters: 3, abbr: ["hab"] }, { name: "Zephaniah", chapters: 3, abbr: ["zeph"] },
        { name: "Haggai", chapters: 2, abbr: ["hag"] }, { name: "Zechariah", chapters: 14, abbr: ["zech"] },
        { name: "Malachi", chapters: 4, abbr: ["mal"] },
        { name: "Matthew", chapters: 28, abbr: ["matt"] }, { name: "Mark", chapters: 16, abbr: ["mk"] },
        { name: "Luke", chapters: 24, abbr: ["lk"] }, { name: "John", chapters: 21, abbr: ["jn"] },
        { name: "Acts", chapters: 28, abbr: ["acts"] }, { name: "Romans", chapters: 16, abbr: ["rom"] },
        { name: "1 Corinthians", chapters: 16, abbr: ["1cor"] }, { name: "2 Corinthians", chapters: 13, abbr: ["2cor"] },
        { name: "Galatians", chapters: 6, abbr: ["gal"] }, { name: "Ephesians", chapters: 6, abbr: ["eph"] },
        { name: "Philippians", chapters: 4, abbr: ["phil"] }, { name: "Colossians", chapters: 4, abbr: ["col"] },
        { name: "1 Thessalonians", chapters: 5, abbr: ["1thess"] }, { name: "2 Thessalonians", chapters: 3, abbr: ["2thess"] },
        { name: "1 Timothy", chapters: 6, abbr: ["1tim"] }, { name: "2 Timothy", chapters: 4, abbr: ["2tim"] },
        { name: "Titus", chapters: 3, abbr: ["titus"] }, { name: "Philemon", chapters: 1, abbr: ["phlm"] },
        { name: "Hebrews", chapters: 13, abbr: ["heb"] }, { name: "James", chapters: 5, abbr: ["jas"] },
        { name: "1 Peter", chapters: 5, abbr: ["1pet"] }, { name: "2 Peter", chapters: 3, abbr: ["2pet"] },
        { name: "1 John", chapters: 5, abbr: ["1jn"] }, { name: "2 John", chapters: 1, abbr: ["2jn"] },
        { name: "3 John", chapters: 1, abbr: ["3jn"] }, { name: "Jude", chapters: 1, abbr: ["jude"] },
        { name: "Revelation", chapters: 22, abbr: ["rev"] }
    ];

    // --- Global State for Current Bible View ---
    let currentBibleBookName = '';
    let currentBibleChapter = 0;
    let currentBibleTranslation = 'kjv';

    // --- Function to toggle visibility of control elements and update title ---
    function toggleAppMode(isBibleMode) {
        console.log("toggleAppMode called. isBibleMode:", isBibleMode); // Debugging log

        // Update main title
        if (appTitle) {
            if (isBibleMode) {
                appTitle.innerHTML = '<span class="orange-text">AVA</span> Bible App';
                console.log("Setting title to Bible App."); // Debugging log
            } else {
                appTitle.innerHTML = '<span class="orange-text">AVA</span> Daily Devotional';
                console.log("Setting title to Daily Devotional."); // Debugging log
            }
        } else {
            console.error("Error: appTitle element not found! Cannot update main title."); // Debugging error
        }

        // Hide/show Bible-specific controls
        bibleControlElements.forEach(el => {
            if (el) el.style.display = isBibleMode ? '' : 'none'; // Use empty string to revert to default display
        });
        // Hide/show Devotional-specific controls
        devotionalControlElements.forEach(el => {
            if (el) el.style.display = isBibleMode ? 'none' : '' ; // Hide devotional elements in Bible mode
        });

        // Update button text and event listeners for 'prevChapterTop' and 'nextChapterTop'
        if (prevChapterTop) {
            prevChapterTop.textContent = isBibleMode ? 'Previous Chapter' : 'Previous Day';
            prevChapterTop.removeEventListener('click', goToPreviousBibleChapter);
            prevChapterTop.removeEventListener('click', prevDay);
            prevChapterTop.addEventListener('click', isBibleMode ? goToPreviousBibleChapter : prevDay);
            prevChapterTop.style.display = 'block';
        }
        if (nextChapterTop) {
            nextChapterTop.textContent = isBibleMode ? 'Next Chapter' : 'Next Day';
            nextChapterTop.removeEventListener('click', goToNextBibleChapter);
            nextChapterTop.removeEventListener('click', nextDay);
            nextChapterTop.addEventListener('click', isBibleMode ? goToNextBibleChapter : nextDay);
            nextChapterTop.style.display = 'block';
        }

        // Handle lower chapter navigation buttons if they exist and you want them to also toggle
        if (prevChapter) {
            prevChapter.textContent = isBibleMode ? 'Previous Chapter' : 'Previous Day';
            prevChapter.removeEventListener('click', goToPreviousBibleChapter);
            prevChapter.removeEventListener('click', prevDay);
            prevChapter.addEventListener('click', isBibleMode ? goToPreviousBibleChapter : prevDay);
            prevChapter.style.display = 'block';
        }
        if (nextChapter) {
            nextChapter.textContent = isBibleMode ? 'Next Chapter' : 'Next Day';
            nextChapter.removeEventListener('click', goToNextBibleChapter);
            nextChapter.removeEventListener('click', nextDay);
            nextChapter.addEventListener('click', isBibleMode ? goToNextBibleChapter : nextDay);
            nextChapter.style.display = 'block';
        }


        // Hide share options when changing modes
        if (shareOptionsTop) shareOptionsTop.style.display = 'none';
        if (shareOptions) shareOptions.style.display = 'none';
    }


    // --- Function to reset the view to the Bible App side ---
    function resetToBibleAppView() {
        answerDisplay.innerHTML = `
            <p style="text-align: center; color: #666; padding: 20px;">
                Enter a Bible verse or topic above to search, or use the book/chapter selectors.
            </p>
        `;
        questionInput.value = '';
        dailyDevotionalButton.textContent = 'Daily Devotional';
        currentBibleBookName = '';
        currentBibleChapter = 0;
        toggleAppMode(true); // Explicitly set to Bible mode, which should hide devotional controls
    }

    // --- Daily Devotional Functionality ---
    function populateDaySelect() {
        if (monthSelect.options.length === 0 || monthSelect.options.length < 12) {
            monthSelect.innerHTML = '';
            for (let i = 1; i <= 12; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.text = new Date(new Date().getFullYear(), i - 1, 1).toLocaleString('default', { month: 'long' });
                monthSelect.add(option);
            }
        }

        const month = parseInt(monthSelect.value);
        const year = new Date().getFullYear();
        const daysInMonth = new Date(year, month, 0).getDate();

        daySelect.innerHTML = '';

        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            daySelect.add(option);
        }
    }

    function getFormattedDate() {
        const month = parseInt(monthSelect.value);
        const day = parseInt(daySelect.value);
        return `${month}.${day}`;
    }

    async function displayDevotional() {
        const formattedDate = getFormattedDate();
        const filename = `devotionals/${formattedDate}-devotional.txt`;
        answerDisplay.innerHTML = '<p style="text-align: center;">Loading Daily Devotional...</p>';

        try {
            const response = await fetch(filename);
            if (!response.ok) {
                if (response.status === 404) {
                    answerDisplay.innerHTML = `
                        <p style="text-align: center; color: #888;">No devotional found for ${formattedDate}.</p>
                        <p style="text-align: center; color: #888;">Edits in Progress for this date.</p>
                        <p style="text-align: center; color: #888;">May God bless your heart for seeking Him! In Jesus' name, Amen!</p>
                    `;
                } else {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
            } else {
                const text = await response.text();
                if (text.trim() === '') {
                    answerDisplay.innerHTML = `
                        <p style="text-align: center; color: #888;">Devotional content is empty for ${formattedDate}.</p>
                        <p style="text-align: center; color: #888;">May God bless your heart for seeking Him! In Jesus' name, Amen!</p>
                    `;
                } else {
                    answerDisplay.innerHTML = text;
                    makeVersesClickable();
                }
            }
        } catch (error) {
            console.error('Error loading devotional:', error);
            answerDisplay.innerHTML = `<p style="text-align: center; color: red;">Error loading devotional.</p><p style="text-align: center; color: red;">Please check your internet connection or try again later.</p>`;
        }
    }

    function nextDay() {
        let month = parseInt(monthSelect.value);
        let day = parseInt(daySelect.value) + 1;
        const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
        if (day > daysInMonth) {
            day = 1;
            month++;
            if (month > 12) {
                month = 1;
            }
        }
        monthSelect.value = month;
        populateDaySelect();
        daySelect.value = day;
        displayDevotional();
    }

    function prevDay() {
        let month = parseInt(monthSelect.value);
        let day = parseInt(daySelect.value) - 1;
        if (day < 1) {
            month--;
            if (month < 1) {
                month = 12;
            }
            const daysInPreviousMonth = new Date(new Date().getFullYear(), month, 0).getDate();
            day = daysInPreviousMonth;
        }
        monthSelect.value = month;
        populateDaySelect();
        daySelect.value = day;
        displayDevotional();
    }

    // --- Daily Devotional Button Event Listener (Toggle Logic) ---
    dailyDevotionalButton.addEventListener('click', async () => {
        if (dailyDev
