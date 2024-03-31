
(function() {
    chrome.storage.local.get((data) => {
        const isLightMode = data.isLightMode === undefined ? true : data.isLightMode;

        // Remove any existing injected styles (optional)
        const existingStyles = document.querySelectorAll('link[rel="stylesheet"][data-theme]');
        for (const style of existingStyles) {
        style.parentNode.removeChild(style);
        }
    
        // Create and inject the appropriate CSS link
        const link = document.createElement("link");
        let url = chrome.runtime.getURL(isLightMode ? "styles-light.css" : "styles-dark.css");
        link.href = url
        link.rel = "stylesheet";
        link.dataset.theme = isLightMode ? "light" : "dark";
        document.head.appendChild(link);
    })
    
  })();
  