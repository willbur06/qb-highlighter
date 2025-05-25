console.log("QB Highlighter content script loaded!");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "HIGHLIGHT") {
    const keywords = request.keywords.map(k => k.trim()).filter(k => k.length > 0);
    if (keywords.length === 0) return;

    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi"); // match full words, case-insensitive
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

    // Collect all text nodes first
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    // Replace all matches in collected nodes
    for (const textNode of textNodes) {
      const parent = textNode.parentNode;
      if (!parent || !textNode.nodeValue.match(regex)) continue;

      const spanWrapper = document.createElement("span");
      spanWrapper.innerHTML = textNode.nodeValue.replace(regex, (match) => {
        return `<span style="background-color: yellow; font-weight: bold;">${match}</span>`;
      });

      parent.replaceChild(spanWrapper, textNode);
    }
  }
});