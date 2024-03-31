// checking youtube appearance mode
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "YOUTUBE_THEME") {
        const isLightMode = message.isLightMode;
        if (isLightMode) {
            storeThemePreference("light");
        } else {
            storeThemePreference("dark");
        }

        injectCSS();
    }
});

// injecting css file based on youtube appearance mode
async function injectCSS() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["injectCss.js"],
        });
    } else {
        console.error("No active tab found!");
    }
}

// storing isLightMode in storage
function storeThemePreference(theme) {
    chrome.storage.local.set({ isLightMode: theme === "light" });
}

// checking if new video is loaded
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if(tab.url && tab.url.includes("youtube.com/watch")) {
      chrome.tabs.sendMessage(tabId, {
        type: "NEW"
      })
    }
  })

