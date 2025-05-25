chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "HIGHLIGHT") {
    const keywords = request.keywords.map(k => k.trim()).filter(k => k.length > 0);
    if (keywords.length === 0) return;

    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi"); // match full words, case-insensitive
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

    const highlightNode = (node) => {
      const parent = node.parentNode;
      if (!parent || !node.nodeValue.match(regex)) return;

      const spanWrapper = document.createElement("span");
      spanWrapper.innerHTML = node.nodeValue.replace(regex, (match) => {
        return `<span style="background-color: yellow; font-weight: bold;">${match}</span>`;
      });

      parent.replaceChild(spanWrapper, node);
    };

    let node;
    while ((node = walker.nextNode())) {
      highlightNode(node);
    }
  }
});
