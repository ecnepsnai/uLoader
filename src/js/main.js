$(function() {
    let injectedFiles = [
        'jquery-3.1.1.min.js',
        'search.js'
    ];

    injectedFiles.forEach(function(file) {
        chrome.tabs.executeScript(null, {
            'file': 'uLoader/assets/js/' + file
        });
    });
});
