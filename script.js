document.addEventListener('DOMContentLoaded', () => {
    // --- Global Element References (updated to match our index.html) ---
    const dailyDevotionalButton = document.getElementById('dailyDevotionalButton');
    const answerDisplay = document.getElementById('answerDisplay'); // This is our main display area
    const darkModeToggle = document.getElementById('darkModeToggle');
    const decreaseFont = document.getElementById('decreaseFont');
    const increaseFont = document.getElementById('increaseFont');

    // Devotional Date Selectors
    const monthSelect = document.getElementById('monthSelect');
    const daySelect = document.getElementById('daySelect');
    const yearDisplay = document.getElementById('yearDisplay');

    // Navigation/Share buttons (using the 'Top' IDs from your HTML for consistency)
    const prevChapterTop = document.getElementById('prevChapterTop');
    const nextChapterTop = document.getElementById('nextChapterTop');
    const copySelectedTop = document.getElementById('copySelectedTop');
    const shareSelectedTop = document.getElementById('shareSelectedTop');
    const shareOptionsTop = document.getElementById('shareOptionsTop'); // The share options div

    // Search input (using existing ID from our current HTML)
    const questionInput = document.getElementById('questionInput');
    const searchButton = document.getElementById('searchButton');

    // --- Daily Devotional Functionality ---
    // Function to populate the daySelect with the correct number of days
    function populateDaySelect() {
        // Populate months (if not already done in HTML)
        if (monthSelect.options.length === 0) {
            for (let i = 1; i <= 12; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.text = new Date(2000, i - 1, 1).toLocaleString('default', { month: 'long' });
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
                        <p>No devotional found for ${formattedDate}.</p>
                        <p>Edits in Progress for this date.</p>
                        <p>May God bless your heart for seeking Him!</p>
                        <p>Just say a prayer for today to Him! In Jesus' name, Amen!</p>
                    `;
                } else {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
            } else {
                const text = await response.text();
                if (text.trim() === '') {
                    answerDisplay.innerHTML = `
                        <p>Devotional content is empty for ${formattedDate}.</p>
                        <p>May God bless your heart for seeking Him!</p>
                        <p>Just say a prayer for today to Him! In Jesus' name, Amen!</p>
                    `;
                } else {
                    answerDisplay.innerHTML = text; // Display the HTML content
                    makeVersesClickable(); // Process for hotlinks after displaying
                }
            }
        } catch (error) {
            console.error('Error loading devotional:', error);
            answerDisplay.innerHTML = "<p>Error loading devotional.</p><p>Please check your internet connection or try again later.</p>";
        }
    }

    // Function to increment the day number
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
        populateDaySelect(); // Repopulate daySelect for the new month
        daySelect.value = day;
        displayDevotional();
    }

    // Function to decrement the day number
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
        populateDaySelect(); // Repopulate daySelect for the new month
        daySelect.value = day;
        displayDevotional();
    }

    // Event listener for the "Daily Devotional" button
    dailyDevotionalButton.addEventListener('click', () => {
        // Set the date to today's date when the button is clicked
        const today = new Date();
        monthSelect.value = today.getMonth() + 1; // Month is 0-indexed
        populateDaySelect(); // Populate days for the current month
        daySelect.value = today.getDate();
        displayDevotional(); // Load today's devotional
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

    // --- Share Button Functionality (adapted for our HTML IDs) ---
    // Note: Your HTML has duplicate IDs for share buttons (e.g., shareFacebookTop and shareFacebook)
    // This code targets elements by their specific 'Top' IDs or directly by their general link ID.
    // Consider restructuring HTML to use classes for common share buttons if possible for cleaner JS.

    // Toggle share options visibility
    if (shareSelectedTop) { // Check if the top share button exists
        shareSelectedTop.addEventListener('click', () => {
            if (shareOptionsTop) {
                shareOptionsTop.style.display = shareOptionsTop.style.display === 'none' ? 'flex' : 'none'; // Use flex for better layout
            }
        });
    }
    // You'll need to do the same for the lower share button if you want both to toggle their respective options
    // const shareSelected = document.getElementById('shareSelected');
    // const shareOptions = document.getElementById('shareOptions');
    // if (shareSelected) {
    //     shareSelected.addEventListener('click', () => {
    //         if (shareOptions) {
    //             shareOptions.style.display = shareOptions.style.display === 'none' ? 'flex' : 'none';
    //         }
    //     });
    // }


    // Share function for individual links (can be reused)
    function shareContent(platform, content, url = 'YOUR_APP_URL_HERE') {
        let shareLink = '';
        const encodedContent = encodeURIComponent(content.trim());
        const encodedUrl = encodeURIComponent(url); // Your app's actual URL

        switch (platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'x': // Twitter
                shareLink = `https://twitter.com/intent/tweet?text=${encodedContent}&url=${encodedUrl}`;
                break;
            case 'reddit':
                shareLink = `https://www.reddit.com/submit?title=${encodedContent.substring(0, 50)}...&url=${encodedUrl}`; // Reddit title is short
                break;
            case 'email':
                shareLink = `mailto:?subject=Shared Content from AVA Bible App&body=${encodedContent}\n\nRead more at: ${url}`;
                break;
            case 'google-docs': // This is not a direct share endpoint, but might open a new doc with content
                // This is a complex integration and might not work as a direct share button.
                // It usually requires Google Drive API or user to copy-paste.
                // For direct share, consider using `navigator.share` API if supported by browser.
                alert('For Google Docs, please copy the content and paste it into a new document.');
                return; // Don't open a new window for this.
            case 'word': // Similar to Google Docs, no direct share link
                alert('For Word, please copy the content and paste it into a new document.');
                return;
            case 'text': // SMS
                shareLink = `sms:?body=${encodedContent}`;
                break;
            // Add Instagram and Snapchat if needed, but they usually require their apps
            default:
                console.warn(`Unsupported share platform: ${platform}`);
                return;
        }

        if (shareLink) {
            window.open(shareLink, '_blank');
        }
    }

    // Attach event listeners to all specific share links (Top and bottom if applicable)
    answerDisplay.addEventListener('click', (event) => {
        // Using event delegation to capture clicks on dynamic share links
        if (event.target.closest('.share-options a')) {
            event.preventDefault();
            const link = event.target.closest('.share-options a');
            const contentToShare = answerDisplay.textContent || ''; // Get content from display
            const appUrl = window.location.href; // The URL of your current app

            if (link.id.includes('shareFacebook')) shareContent('facebook', contentToShare, appUrl);
            else if (link.id.includes('shareX')) shareContent('x', contentToShare, appUrl);
            else if (link.id.includes('shareReddit')) shareContent('reddit', contentToShare, appUrl);
            else if (link.id.includes('shareGoogleDocs')) shareContent('google-docs', contentToShare, appUrl);
            else if (link.id.includes('shareWord')) shareContent('word', contentToShare, appUrl);
            else if (link.id.includes('shareEmail')) shareContent('email', contentToShare, appUrl);
            else if (link.id.includes('shareText')) shareContent('text', contentToShare, appUrl);
        }
    });

    // --- Audio/Text-to-Speech ---
    const audioButton = document.getElementById('audioButton'); // Assuming you have this ID in HTML
    if (audioButton) {
        audioButton.addEventListener('click', () => {
            const contentToRead = answerDisplay.textContent; // Read text from devotional
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(contentToRead);
                speechSynthesis.speak(utterance);
            } else {
                alert('Sorry, your browser does not support text-to-speech.');
            }
        });
    }

    // --- Previous/Next Day Buttons ---
    const prevDevotionalButton = document.getElementById('prevDevotional'); // Make sure ID is correct
    const nextDevotionalButton = document.getElementById('nextDevotional'); // Make sure ID is correct

    if (prevDevotionalButton) prevDevotionalButton.addEventListener('click', prevDay);
    if (nextDevotionalButton) nextDevotionalButton.addEventListener('click', nextDay);


    // --- Copy Selected Verse (Adapt from your original code if needed) ---
    // You likely have a copySelectedTop and copySelected button in your HTML.
    // We need to implement the logic for these.
    function copySelectedVerse(targetElementId) {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText)
                .then(() => alert('Verse copied to clipboard!'))
                .catch(err => console.error('Failed to copy text: ', err));
        } else {
            alert('Please select some text to copy.');
        }
    }

    if (copySelectedTop) {
        copySelectedTop.addEventListener('click', () => copySelectedVerse('answerDisplay'));
    }
    // If you have a separate copySelected for the bottom, you can add:
    // const copySelected = document.getElementById('copySelected');
    // if (copySelected) copySelected.addEventListener('click', () => copySelectedVerse('answerDisplay'));


    // --- Bible App Button (External Redirect) - COMMENTED OUT FOR NOW ---
    // If you want to switch to an external Bible App, uncomment this and adjust.
    // const bibleAppButton = document.getElementById('bibleAppButton');
    // if (bibleAppButton) {
    //     bibleAppButton.addEventListener('click', () => {
    //         window.location.href = 'https://jaytrust150.github.io/bible-app/';
    //     });
    // }

    // --- Search Functionality (External Redirect) - COMMENTED OUT FOR NOW ---
    // Your original search in script.js used bible-api.com internally.
    // The provided JS block's search redirects externally.
    // Choose one approach. Keeping our internal one for now.
    // const searchInput = document.getElementById('searchInput'); // If you add this ID to your HTML
    // const searchButton = document.getElementById('searchButton'); // Your HTML has a searchButton
    // if (searchButton) {
    //     searchButton.addEventListener('click', () => {
    //         const searchQuery = questionInput.value; // Using questionInput from our HTML
    //         const bibleAppURL = `https://jaytrust150.github.io/bible-app/?query=${encodeURIComponent(searchQuery)}`;
    //         window.location.href = bibleAppURL;
    //     });
    // }


    // --- Our Existing Internal Search (from previous steps) ---
    // This is the core search to bible-api.com for verses within our app.
    // We need this function to be available for hotlinking too.
    async function fetchBibleVerse(query) {
        answerDisplay.innerHTML = '<p>Searching Bible...</p>';
        try {
            // This is still a basic formatting. We'll make this smarter for real verse parsing.
            const formattedQuery = query.replace(/\s/g, '').toLowerCase(); 
            const response = await fetch(`https://bible-api.com/${formattedQuery}?translation=kjv`); // Hardcoded KJV for now
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for query: "${query}"`);
            }

            const data = await response.json();

            if (data.verses && data.verses.length > 0) {
                let resultHtml = `<h2>${data.reference}</h2>`;
                data.verses.forEach(verse => {
                    resultHtml += `<p><strong>${verse.verse}</strong> ${verse.text}</p>`;
                });
                answerDisplay.innerHTML = resultHtml;
            } else {
                answerDisplay.innerHTML = `<p>No Bible verses found for "${query}". Please try a more specific reference like "John 3:16" or "Gen 1:1".</p>`;
            }

        } catch (error) {
            console.error('Error fetching Bible verse:', error);
            answerDisplay.innerHTML = `<p>Error fetching verses: ${error.message}. Please check your query or try again later.</p>`;
        }
    }

    // Original search button for internal search
    if (searchButton) { // Check if searchButton exists in HTML
        searchButton.addEventListener('click', () => {
            const query = questionInput.value.trim();
            if (query) {
                fetchBibleVerse(query);
            } else {
                answerDisplay.innerHTML = '<p>Please enter a Bible verse or topic to search.</p>';
            }
        });
    }

    // --- Hotlinking Verses in Devotional ---
    function makeVersesClickable() {
        const verseRegex = /(\d?\s?[A-Za-z]+\s+\d+:\d+(?:-\d+)?(?:-\d+)?)/g; // Improved regex for ranges
        
        // Target the #answerDisplay div where devotional content is loaded
        const contentDiv = answerDisplay;

        // Use innerHTML to allow regex to work on the string content
        let htmlContent = contentDiv.innerHTML;
        let newHtmlContent = htmlContent.replace(verseRegex, (match) => {
            // Ensure we don't re-wrap already linked text, if any
            if (match.includes('<a') || match.includes('</a>')) {
                return match; // Don't re-process if already a link
            }
            return `<a href="#" class="devotional-verse-link" data-verse="${match}">${match}</a>`;
        });
        contentDiv.innerHTML = newHtmlContent; // Update innerHTML with clickable links

        // Add event listeners to the newly created links
        contentDiv.querySelectorAll('.devotional-verse-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                const verseQuery = event.target.dataset.verse;
                console.log("Clicked devotional verse hotlink:", verseQuery);
                openVerseInMainApp(verseQuery);
            });
        });
    }

    // Function to Handle Opening Verse in Main App via internal search
    async function openVerseInMainApp(verseQuery) {
        // Clean up the query for better parsing by fetchBibleVerse
        // Remove trailing "NASB95" or other translation mentions if they exist for now
        const cleanedQuery = verseQuery.replace(/\s+NASB95$/i, '').trim(); 
        
        // Use our existing internal search
        await fetchBibleVerse(cleanedQuery);
        // Optionally, you might want to scroll to the search result area
        // answerDisplay.scrollIntoView({ behavior: 'smooth' });
    }

    // --- Initial Setup Calls ---
    populateDaySelect(); // Populate month and day dropdowns
    yearDisplay.textContent = new Date().getFullYear(); // Set the current year
    
    // Set initial values for month and day selects to today's date
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Month is 0-indexed
    const currentDay = today.getDate();
    monthSelect.value = currentMonth;
    populateDaySelect(); // Repopulate daySelect for the current month after setting month
    daySelect.value = currentDay;

    displayDevotional(); // Load the initial (today's) devotional on app start

    // Event listeners for month/day select changes
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
