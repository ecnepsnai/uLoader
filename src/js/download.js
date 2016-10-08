chrome.runtime.onMessage.addListener(function(message) {
    if (message.event === 'uLoader-download-file') {
        chrome.downloads.download({
            url: message.url
        });
    }
});
