import { LOOKMOVIE_MOVIE_URL, LOOKMOVIE_SHOW_URL, API_URL, LOOKMOVIE_TITLE_XPATH } from './urls.js';

const TIMER_DURATION_SECONDS = 300;
const CHECK_INTERVAL_SECONDS = 5;
let activeTimer = null;
let activeInterval = null;
let activeTabId = null;
let lastSentTitle = null;

function clearAllTimers() {
    if (activeTimer) {
        console.log('Clearing active timer');
        clearTimeout(activeTimer);
        activeTimer = null;
    }
    if (activeInterval) {
        clearInterval(activeInterval);
        activeInterval = null;
    }
    activeTabId = null;
}

async function sendToServer(title) {
    if (title === lastSentTitle) {
        console.log('Title already sent, skipping:', title);
        return;
    }
    
    try {
        console.log('Sending to server:', title);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                movieName: title,
                category: 'viewed'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Successfully sent to server:', data);
            lastSentTitle = title;
        } else {
            console.error('Server returned error:', response.status);
        }
    } catch (error) {
        console.error('Failed to send to server:', error);
    }
}

function removeYearFromTitle(title) {
    return title.replace(/\d{4}$/, '').trim();
}

function startTitleCheck(tabId, initialUrl) {
    clearAllTimers();
    
    console.log('Starting timer for tab:', tabId);
    activeTabId = tabId;

    let timeRemaining = TIMER_DURATION_SECONDS;
    
    activeInterval = setInterval(() => {
        chrome.tabs.get(tabId, (tab) => {
            if (!tab || tab.url !== initialUrl) {
                console.log('URL changed or tab closed, stopping timer');
                clearAllTimers();
                return;
            }
            
            console.log(`Time remaining: ${timeRemaining} seconds`);
            timeRemaining -= CHECK_INTERVAL_SECONDS;
        });
    }, CHECK_INTERVAL_SECONDS * 1000);

    activeTimer = setTimeout(() => {
        clearInterval(activeInterval);
        activeInterval = null;
        chrome.tabs.get(tabId, (tab) => {
            if (tab && tab.url === initialUrl) {
                // We're still on the same page, get the title
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: (xpath) => {
                        const element = document.evaluate(
                            xpath, 
                            document, 
                            null, 
                            XPathResult.FIRST_ORDERED_NODE_TYPE, 
                            null
                        ).singleNodeValue;
                        return element ? element.textContent.trim() : null;
                    },
                    args: [LOOKMOVIE_TITLE_XPATH]
                }, (results) => {
                    if (results && results[0] && results[0].result) {
                        let title = results[0].result;
                        console.log('Title found (raw):', title);
                        title = removeYearFromTitle(title);
                        console.log('Title cleaned:', title);
                        sendToServer(title);
                    } else {
                        console.log('No title found or extraction failed');
                    }
                });
            } else {
                console.log('Tab closed or URL changed before timer completed');
            }
        });
        activeTimer = null;
        activeTabId = null;
    }, TIMER_DURATION_SECONDS * 1000);
}

function checkUrl(tabId, url) {
    console.log('Checking URL:', url);
    if (url && url.includes('lookmovie2.to')) {
        if (url.includes(LOOKMOVIE_MOVIE_URL) || url.includes(LOOKMOVIE_SHOW_URL)) {
            console.log('lookmovie site detected!');
            startTitleCheck(tabId, url);
            
        }
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('Tab updated:', tabId, changeInfo);
    if (changeInfo.url) {
        checkUrl(tabId, changeInfo.url);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    if (activeTabId !== null && activeTabId !== activeInfo.tabId) {
        console.log('Tab switched away, clearing timer');
        clearAllTimers();
    }
    
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            checkUrl(tab.id, tab.url);
        }
    });
});

console.log('Background service worker initialized');

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if (tab.url) {
                checkUrl(tab.id, tab.url);
            }
        });
    });
});
