chrome.runtime.onMessage.addListener(function(message) {
    console.log(message);
    if (message.event === 'uLoader-download-file') {
        chrome.downloads.download({
            url: message.url
        });
    }
});
