chrome.runtime.onMessage.addListener(function(message) {
    if (message.event === 'uLoader-download-files') {
        message.files.forEach(function(file) {
            chrome.downloads.download({
                url: file.url
            });
        });
    }
});
