


browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // url didn't change
    if (!changeInfo.url) return;

    browser.tabs.sendMessage(tabId, {videoChanged: true});
});