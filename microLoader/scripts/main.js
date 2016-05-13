///////////////////////////////////////////////////////////
/// Execute the content script on extension window load
///////////////////////////////////////////////////////////
window.onload = function windowLoaded() {

    try {

        // Set extension page body size
        $(document.body).width(PAGE_DEFAULT_WIDTH);
        $(document.body).height(PAGE_DEFAULT_HEIGHT);
        $(document.body).css("overflow", PAGE_DEFAULT_SCROLL_STYLE);

        // Display pending message
        buildMessageDiv(PENDING_LOAD_MSG);

        // Action depends on the page URL
        chrome.tabs.getSelected(null, function (tab) {
            if (tab.url.match("^ftp") === null && tab.url.match("^http") === null) {
                buildMessageDiv(NON_WEBSITE_PAGE);
                return;
            }

            if (tab.url.match("^https://chrome.google.com/webstore") !== null) {
                buildMessageDiv(CHROME_WEBSTORE_SITE);
                return;
            }

            // Inject the scripts to hosting page
            chrome.tabs.executeScript(null, { file: "microLoader/scripts/utils.js" });
            chrome.tabs.executeScript(null, { file: "microLoader/scripts/externals/jquery-1.7.2.min.js" });
            chrome.tabs.executeScript(null, { file: "microLoader/scripts/content.js" });
        });

    } catch (exc) { utils.alertExceptionDetails(exc); }
};

////////////////////////////////////////////////////////////////////
/// Assign listener for messages from content script
////////////////////////////////////////////////////////////////////
chrome.extension.onConnect.addListener(
    function (port) {

        // Listen to messages only on the right connection
        if (port.name == "content-extension") {
            gContentConnectionPort = port;
            port.onMessage.addListener(buildThePage);
        }
    });
