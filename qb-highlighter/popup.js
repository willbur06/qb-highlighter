document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      const keywords = reader.result
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
  
      // Send keywords to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "HIGHLIGHT", keywords });
      });
    };
  
    reader.readAsText(file);
  });
  