chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^https?:/.test(tab.url)) {
        chrome.storage.local.get('keywords', (result) => {
            if (result.keywords && result.keywords.length > 0) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ['content.js']
                }, () => {
                    chrome.tabs.sendMessage(tabId, { type: "HIGHLIGHT", keywords: result.keywords });
                });
            }
        });
    }
});