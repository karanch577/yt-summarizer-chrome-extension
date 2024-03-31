async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTab();
    const queryParams = activeTab.url.split("?")[1];
    const urlParams = new URLSearchParams(queryParams)

    const currentVideo = urlParams.get("v")

    const container = document.getElementsByClassName("yts-body")[0];

    if(activeTab.url.includes("youtube.com/watch") && currentVideo) {
        container.innerHTML = `<div class="title">Click on the summarize button below to get the summary</div>`;
    } else {
        container.innerHTML = `<div class="title">This is not a youtube video page.</div>`;
    }
});
