document.addEventListener('DOMContentLoaded', () => {
    // --- Global Element References ---
    const dailyDevotionalButton = document.getElementById('dailyDevotionalButton');
    const answerDisplay = document.getElementById('answerDisplay'); // This is our main display area
    const questionInput = document.getElementById('questionInput'); // For the main Bible search input
    const searchButton = document.getElementById('searchButton'); // For the main Bible search button
    const darkModeToggle = document.getElementById('darkModeToggle');
    const decreaseFont = document.getElementById('decreaseFont');
    const increaseFont = document.getElementById('increaseFont');

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


    // --- Function to reset the view to the Bible App side ---
    function resetToBibleAppView() {
        answerDisplay.innerHTML = `
            <p style="text-align: center; color: #666; padding: 20px;">
                Enter a Bible verse or topic above to search, or use the book/chapter selectors.
            </p>
        `;
        questionInput.value = ''; // Clear any previous search query
        dailyDevotionalButton.textContent = 'Daily Devotional'; // Reset button text
        // Ensure share options are hidden when switching back
        if (shareOptionsTop) shareOptionsTop.style.display = 'none';
        if (shareOptions) shareOptions.style.display = 'none';
    }

    // --- Daily Devotional Functionality ---
    // Function to populate the daySelect with the correct number of days
    function populateDaySelect() {
        // Populate months if they are not already populated in the HTML
        if (monthSelect.options.length === 0 || monthSelect.options.length < 12) { // Ensure all 12 months are there
            monthSelect.innerHTML = ''; // Clear existing options if incomplete
            for (let i = 1; i <= 12; i++) {
                const option = document.createElement('option');
                option.value = i;
                // Get month name for display
                option.text = new Date(new Date().getFullYear(), i - 1, 1).toLocaleString('default', { month: 'long' });
                monthSelect.add(option);
            }
        }

        const month = parseInt(monthSelect.value);
        const year = new Date().getFullYear(); // Get current year for accurate days in month
        const daysInMonth = new Date(year, month, 0).getDate(); // Get days in selected month

        daySelect.innerHTML = ''; // Clear existing options

        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            daySelect.add(option);
        }
    }

    // Function to get the formatted date (e.g., "1.1" for January 1st)
    function getFormattedDate() {
        const month = parseInt(monthSelect.value);
        const day = parseInt(daySelect.value);
        return `${month}.${day}`;
    }

    // Function to fetch and display the devotional
    async function displayDevotional() {
        const formattedDate = getFormattedDate();
        const filename = `devotionals/${formattedDate}-devotional.txt`;
        answerDisplay.innerHTML = '<p>Loading Daily Devotional...</p>'; // Show loading message

        try {
            const response = await fetch(filename);
            if (!response.ok) {
                // If the file is not found (404), display placeholder text
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
                    answerDisplay.innerHTML = text; // Display the HTML content
                    makeVersesClickable(); // Process for hotlinks after displaying
                }
            }
        } catch (error) {
            console.error('Error loading devotional:', error);
            answerDisplay.innerHTML = "<p style='text-align: center; color: red;'>Error loading devotional.</p><p style='text-align: center; color: red;'>Please check your internet connection or try again later.</p>";
        }
    }

    // Function to increment the day number for devotionals
    function nextDay() {
        let month = parseInt(monthSelect.value);
        let day = parseInt(daySelect.value) + 1;

        const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
        if (day > daysInMonth) {
            day = 1;
            month++;
            if (month > 12) {
                month = 1; // Wrap around to January
            }
        }
        monthSelect.value = month;
        populateDaySelect(); // Repopulate daySelect for the new month
        daySelect.value = day;
        displayDevotional();
    }

    // Function to decrement the day number for devotionals
    function prevDay() {
        let month = parseInt(monthSelect.value);
        let day = parseInt(daySelect.value) - 1;

        if (day < 1) {
            month--;
            if (month < 1) {
                month = 12; // Wrap around to December
            }
            const daysInPreviousMonth = new Date(new Date().getFullYear(), month, 0).getDate();
            day = daysInPreviousMonth;
        }
        monthSelect.value = month;
        populateDaySelect(); // Repopulate daySelect for the new month
        daySelect.value = day;
        displayDevotional();
    }

    // --- Daily Devotional Button Event Listener (Toggle Logic) ---
    dailyDevotionalButton.addEventListener('click', async () => {
        if (dailyDevotionalButton.textContent === 'Daily Devotional') {
            // Current state is "Daily Devotional", so load devotional
            // Set the date to today's date when switching to devotional view
            const today = new Date();
            monthSelect.value = today.getMonth() + 1; // Month is 0-indexed
            populateDaySelect(); // Populate days for the current month
            daySelect.value = today.getDate();

            await displayDevotional(); // Load and display today's devotional
            dailyDevotionalButton.textContent = 'Bible App'; // Change button text
        } else {
            // Current state is "Bible App", so switch back to Bible view
            resetToBibleAppView();
        }
    });


    // --- Dark Mode Toggle ---
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // --- Font Size Controls ---
    let currentFontSize = 16; // Set an initial font size for the display area

    decreaseFont.addEventListener('click', () => {
        currentFontSize = Math.max(10, currentFontSize - 2); // Prevent font from getting too small
        answerDisplay.style.fontSize = currentFontSize + 'px';
    });

    increaseFont.addEventListener('click', () => {
        currentFontSize = Math.min(30, currentFontSize + 2); // Prevent font from getting too large
        answerDisplay.style.fontSize = currentFontSize + 'px';
    });

    // --- Copy Selected Verse ---
    function copySelectedVerse() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText)
                .then(() => alert('Verse copied to clipboard!'))
                .catch(err => console.error('Failed to copy text: ', err));
        } else {
            alert('Please select some text to copy.');
        }
    }

    // Attach to both top and bottom copy buttons if they exist
    if (copySelectedTop) {
        copySelectedTop.addEventListener('click', copySelectedVerse);
    }
    if (copySelected) {
        copySelected.addEventListener('click', copySelectedVerse);
    }

    // --- Share Button Functionality ---
    // Toggle share options visibility for top share button
    if (shareSelectedTop) {
        shareSelectedTop.addEventListener('click', () => {
            if (shareOptionsTop) {
                shareOptionsTop.style.display = shareOptionsTop.style.display === 'none' ? 'flex' : 'none';
            }
        });
    }
    // Toggle share options visibility for lower share button
    if (shareSelected) {
        shareSelected.addEventListener('click', () => {
            if (shareOptions) {
                shareOptions.style.display = shareOptions.style.display === 'none' ? 'flex' : 'none';
            }
        });
    }

    // Share function for individual links (reusable)
    function shareContent(platform, content, url = window.location.href) {
        let shareLink = '';
        const encodedContent = encodeURIComponent(content.trim());
        const encodedUrl = encodeURIComponent(url);

        switch (platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'x': // Twitter
                shareLink = `https://twitter.com/intent/tweet?text=${encodedContent}&url=${encodedUrl}`;
                break;
            case 'reddit':
                // Reddit prefers content in the text parameter for self-posts if no URL, or title for URL share
                shareLink = `https://www.reddit.com/submit?title=${encodeURIComponent('Shared from AVA Bible App')}&text=${encodedContent}`;
                break;
            case 'email':
                shareLink = `mailto:?subject=Shared Content from AVA Bible App&body=${encodedContent}\n\nRead more at: ${url}`;
                break;
            case 'google-docs':
            case 'word':
                alert('For Google Docs/Word, please copy the content using "Copy Selected Verse" and paste it into a new document.');
                return;
            case 'text': // SMS
                shareLink = `sms:?body=${encodedContent}`;
                break;
            default:
                console.warn(`Unsupported share platform: ${platform}`);
                return;
        }

        if (shareLink) {
            window.open(shareLink, '_blank');
        }
    }

    // Attach event listeners to all specific share links (top and bottom) using event delegation
    // This allows dynamically added content to also have working links.
    answerDisplay.addEventListener('click', (event) => {
        const link = event.target.closest('.share-options a');
        if (link) {
            event.preventDefault();
            const contentToShare = answerDisplay.textContent || ''; // Get text content from display
            const platformId = link.id.toLowerCase().replace(/top$/, ''); // Remove 'Top' to get base platform name

            if (platformId.includes('facebook')) shareContent('facebook', contentToShare);
            else if (platformId.includes('x')) shareContent('x', contentToShare);
            else if (platformId.includes('reddit')) shareContent('reddit', contentToShare);
            else if (platformId.includes('googledocs')) shareContent('google-docs', contentToShare);
            else if (platformId.includes('word')) shareContent('word', contentToShare);
            else if (platformId.includes('email')) shareContent('email', contentToShare);
            else if (platformId.includes('text')) shareContent('text', contentToShare);
        }
    });
    // You might also need listeners on the fixed share links if they are not inside answerDisplay
    // Example for top links outside answerDisplay:
    document.querySelectorAll('#shareOptionsTop a, #shareOptions a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const contentToShare = answerDisplay.textContent || ''; // Or use a specific verse if copied
            const platformId = event.target.id.toLowerCase().replace(/top$/, '');

            if (platformId.includes('facebook')) shareContent('facebook', contentToShare);
            else if (platformId.includes('x')) shareContent('x', contentToShare);
            else if (platformId.includes('reddit')) shareContent('reddit', contentToShare);
            else if (platformId.includes('googledocs')) shareContent('google-docs', contentToShare);
            else if (platformId.includes('word')) shareContent('word', contentToShare);
            else if (platformId.includes('email')) shareContent('email', contentToShare);
            else if (platformId.includes('text')) shareContent('text', contentToShare);
        });
    });


    // --- Audio/Text-to-Speech ---
    const audioButton = document.getElementById('audioButton'); // Assuming you have this ID in HTML
    if (audioButton) {
        audioButton.addEventListener('click', () => {
            const contentToRead = answerDisplay.textContent; // Read text from devotional or verse display
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(contentToRead);
                speechSynthesis.speak(utterance);
            } else {
                alert('Sorry, your browser does not support text-to-speech.');
            }
        });
    }

    // --- Previous/Next Day/Chapter Buttons (for Devotional and general navigation) ---
    if (prevChapterTop) prevChapterTop.addEventListener('click', prevDay); // For devotional previous day
    if (nextChapterTop) nextChapterTop.addEventListener('click', nextDay); // For devotional next day
    // If you also want these for Bible chapters, we'll need separate logic
    // For now, these operate on the devotional dates.


    // --- Core Bible Search Functionality (Internal API Call) ---
    async function fetchBibleVerse(query) {
        answerDisplay.innerHTML = '<p style="text-align: center;">Searching Bible...</p>';
        try {
            // Regex to extract book, chapter, verse(s) and potentially translation
            // This is a more robust parser than before, but still basic.
            // Example: "John 3:16", "Gen 1:1-5", "Psalm 23", "Romans 8"
            const verseMatch = query.match(/^(\d?\s*[A-Za-z]+)\s*(\d+)(?::(\d+)(?:-(\d+))?)?(\s+[A-Za-z0-9]+)?$/i);
            let formattedQuery = '';
            let translation = 'kjv'; // Default translation

            if (verseMatch) {
                const book = verseMatch[1].trim();
                const chapter = verseMatch[2];
                const startVerse = verseMatch[3];
                const endVerse = verseMatch[4];
                const requestedTranslation = verseMatch[5] ? verseMatch[5].trim() : '';

                // Map common book abbreviations (expand as needed)
                const bookMap = {
                    'gen': 'genesis', 'ex': 'exodus', 'lev': 'leviticus', 'num': 'numbers', 'deut': 'deuteronomy',
                    'matt': 'matthew', 'mk': 'mark', 'lk': 'luke', 'jn': 'john', 'rom': 'romans',
                    'cor': 'corinthians', 'rev': 'revelation', 'ps': 'psalm', 'prov': 'proverbs',
                    // Add more as needed for your desired functionality
                };
                const formattedBook = bookMap[book.toLowerCase()] || book;

                if (startVerse && endVerse) {
                    formattedQuery = `${formattedBook}${chapter}.${startVerse}-${endVerse}`;
                } else if (startVerse) {
                    formattedQuery = `${formattedBook}${chapter}.${startVerse}`;
                } else {
                    formattedQuery = `${formattedBook}${chapter}`; // Fetch entire chapter
                }

                // Check for requested translation (bible-api.com supports kjv, web, asv)
                if (requestedTranslation) {
                    const supportedTranslations = ['kjv', 'web', 'asv', 'nasb', 'nasb95']; // Add more if API supports
                    if (supportedTranslations.includes(requestedTranslation.toLowerCase())) {
                        translation = requestedTranslation.toLowerCase();
                    }
                }
            } else {
                // If it's not a direct verse reference, try simple query for general search (might not work well with simple API)
                formattedQuery = query.replace(/[\s.,;:]/g, '').toLowerCase();
            }

            if (!formattedQuery) {
                throw new Error("Invalid Bible query format. Please try 'John 3:16' or 'Genesis 1'.");
            }

            const response = await fetch(`https://bible-api.com/${formattedQuery}?translation=${translation}`);
            
            if (!response.ok) {
                // Check if the error is due to an invalid verse
                if (response.status === 404) {
                    throw new Error(`Verse not found for query "${query}". Please check the spelling or reference.`);
                }
                throw new Error(`HTTP error! status: ${response.status} for query: "${query}"`);
            }

            const data = await response.json();

            if (data.verses && data.verses.length > 0) {
                let resultHtml = `<h2>${data.reference} (${data.translation_name.toUpperCase()})</h2>`;
                data.verses.forEach(verse => {
                    resultHtml += `<p><strong>${verse.verse}</strong> ${verse.text}</p>`;
                });
                answerDisplay.innerHTML = resultHtml;
            } else {
                answerDisplay.innerHTML = `<p style="text-align: center;">No Bible verses found for "${query}". Please try a more specific reference like "John 3:16" or "Gen 1:1".</p>`;
            }

        } catch (error) {
            console.error('Error fetching Bible verse:', error);
            answerDisplay.innerHTML = `<p style="text-align: center; color: red;">Error: ${error.message}. Please check your query or try again later.</p>`;
        }
    }

    // Main search button event listener
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const query = questionInput.value.trim();
            if (query) {
                fetchBibleVerse(query);
            } else {
                answerDisplay.innerHTML = '<p style="text-align: center;">Please enter a Bible verse or topic to search.</p>';
            }
        });
    }

    // --- Hotlinking Verses in Devotional (and any future loaded content) ---
    function makeVersesClickable() {
        // More robust regex for identifying various verse formats.
        // Captures: (Optional Number) BookName (Optional Chapter:Verse-Verse)
        // E.g., "John 3:16", "1 Cor 13", "Psalm 23:1-6", "Rom 8"
        const verseRegex = /(\b(?:[123]\s?[A-Z][a-z]+|[A-Z][a-z]+)\s+\d+(?::\d+(?:-\d+)?)?)\b/g;
        
        const contentDiv = answerDisplay;
        let htmlContent = contentDiv.innerHTML; // Get current HTML content

        // Replace matched text with clickable links
        let newHtmlContent = htmlContent.replace(verseRegex, (match) => {
            // Avoid re-wrapping if already a link or part of an existing tag
            if (match.includes('<a') || match.includes('</a>') || match.includes('<strong')) {
                return match;
            }
            return `<a href="#" class="devotional-verse-link" data-verse="${match}">${match}</a>`;
        });
        contentDiv.innerHTML = newHtmlContent; // Update the content with links

        // Add event listeners to the newly created links using delegation
        // (Listeners are attached to answerDisplay and check for clicks on .devotional-verse-link)
        // Note: This delegation might cause issues if not carefully managed when answerDisplay.innerHTML is reset frequently.
        // It's better to add the listener once to answerDisplay and check the target.
        // I've moved the listener creation outside this function, assuming it will be done once on DOMContentLoaded.
    }

    // Event listener for dynamically added devotional verse links
    answerDisplay.addEventListener('click', (event) => {
        const link = event.target.closest('.devotional-verse-link');
        if (link) {
            event.preventDefault(); // Prevent default link behavior
            const verseQuery = link.dataset.verse;
            console.log("Clicked devotional verse hotlink:", verseQuery);
            openVerseInMainApp(verseQuery);
        }
    });

    // Function to Handle Opening Verse in Main App via internal search
    async function openVerseInMainApp(verseQuery) {
        // Clean up the query for better parsing by fetchBibleVerse
        const cleanedQuery = verseQuery.replace(/\s+(NASB95|KJV|ASV|WEB)$/i, '').trim();
        
        // Use our existing internal search
        await fetchBibleVerse(cleanedQuery);
        // Optionally, you might want to scroll to the search result area
        // answerDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Initial Setup Calls ---
    populateDaySelect(); // Populate month and day dropdowns
    yearDisplay.textContent = new Date().getFullYear(); // Set the current year
    
    // Set initial values for month and day selects to today's date
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Month is 0-indexed (Jan is 0)
    const currentDay = today.getDate();
    monthSelect.value = currentMonth;
    populateDaySelect(); // Repopulate daySelect for the current month after setting month
    daySelect.value = currentDay;

    resetToBibleAppView(); // Start the app on the Bible search view

    // Event listeners for month/day select changes (for devotionals)
    monthSelect.addEventListener('change', () => {
        populateDaySelect();
        displayDevotional();
    });
    daySelect.addEventListener('change', displayDevotional);

    // Initial check for Dark Mode preference (optional, could use localStorage)
    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //     document.body.classList.add('dark-mode');
    // }
});
