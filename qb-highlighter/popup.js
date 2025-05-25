document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const keywords = reader.result
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);

        // Store keywords for later use
        chrome.storage.local.set({ keywords }, () => {
            // Optionally, send to content script on the current page immediately as before
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const tab = tabs[0];
                if (tab.url.startsWith("http://") || tab.url.startsWith("https://")) {
                    chrome.tabs.sendMessage(tab.id, { type: "HIGHLIGHT", keywords }, (response) => {
                        if (chrome.runtime.lastError) {
                            alert("Could not highlight: " + chrome.runtime.lastError.message);
                        } else if (response && response.success) {
                            // Success!
                        }
                    });
                } else {
                    alert("Highlighting only works on regular web pages. Current URL: " + tab.url);
                }
            });
        });
    };

    reader.readAsText(file);
});