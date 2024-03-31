let isDivInjected = false;

// checking youtube's appearance mode
const themeColorMeta = document.querySelector("meta[name='theme-color']");

if (themeColorMeta?.content.includes("255, 255, 255")) {
  chrome.runtime.sendMessage({ type: "YOUTUBE_THEME", isLightMode: true });
} else {
  chrome.runtime.sendMessage({ type: "YOUTUBE_THEME", isLightMode: false });
}

// Create the spinner element 
const spinnerContainer = document.createElement('div');
spinnerContainer.classList.add('spinner-container');

const ldsRing = document.createElement('div');
ldsRing.classList.add('lds-ring');

for (let i = 0; i < 4; i++) {
  const dot = document.createElement('div');
  ldsRing.appendChild(dot);
}

spinnerContainer.appendChild(ldsRing);

// spinner end

const ytDiv = document.createElement("div");
ytDiv.classList.add(["summary-container"]);

// Summary div
const summaryDiv = document.createElement("div");
summaryDiv.classList.add(["summary-res"]);

// Summarize button
const summarizeBtn = document.createElement("button");
summarizeBtn.innerText = "Summarize";
summarizeBtn.classList.add(["summary-btn"]);

chrome.runtime.onMessage.addListener((request) => {
  const { type } = request;

  if(type === "NEW") {
    summaryDiv.innerText = "Click the summarize button to get the summary of this video";
  }
})

// youtube's webpage structure changes dynamically - so using MutationObserver to observe on these changes and inject our code when the div with id="related" is loaded

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0 && !isDivInjected) {
      isDivInjected = true;

      const related = document.querySelector('#related');

      summaryDiv.innerText = "Click the summarize button to get the summary of this video";

      if (related) {
        summarizeBtn.addEventListener("click", async () => {
          // Disable button immediately
          summarizeBtn.disabled = true; 

          // clearing the previous response
          summaryDiv.innerText = ""

          // Append spinner to summary div before API call
          summaryDiv.appendChild(spinnerContainer);

          const videoId = new URL(window.location.href).searchParams.get('v');
          try {
            const res = await fetch(`https://yt-summarizer-backend-production.up.railway.app/api/summary?videoId=${videoId}`);

            if (!res.ok) {
              throw new Error("Failed to fetch summary");
            }

            const data = await res.json();

            if (data) {
              summaryDiv.innerText = data.summary;
            } else {
              summaryDiv.innerText = "No summary available";
            }
          } catch (error) {
            console.error("Error fetching summary:", error);
            summaryDiv.innerText = "Failed to fetch summary";
          } finally {
            // Re-enable button after success or failure
            summarizeBtn.disabled = false;  
          }
        });

        ytDiv.append(summarizeBtn);
        ytDiv.append(summaryDiv);

        related.prepend(ytDiv);
      }
      observer.disconnect();
    }
  });
});

const config = { childList: true };
observer.observe(document.body, config);

