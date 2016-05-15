// Build delimiter
function buildDelimiter(parentElem) {

    var delimDiv = document.createElement('div');
    delimDiv.name = DELIM_DIVS_NAME;
    delimDiv.appendChild(document.createElement('hr'));

    parentElem.appendChild(delimDiv);
}

// Build message div
function buildMessageDiv(message) {
    var noLinksMsgDiv = document.getElementById(NO_LINKS_MESSAGE_DIV_ID);

    // Clear previous message
    $('.messageToUser').empty();

    noLinksMsgDiv.appendChild(document.createElement('hr'));
    noLinksMsgDiv.appendChild(document.createElement('br'));
    noLinksMsgDiv.appendChild(document.createTextNode(message));
}

function displayProgressMessage(linksAmount) {
    buildMessageDiv('Found ' + linksAmount + ' files, preparing the display (don\'t give up) ...');
}
function clearDefaultMessage() {
    var noLinksMsgDiv = document.getElementById(NO_LINKS_MESSAGE_DIV_ID);

    noLinksMsgDiv.childNodes.forEach(function(node) {
        noLinksMsgDiv.removeChild(node);
    });

    noLinksMsgDiv.innerHTML = '';
}
function linksMsgToGlobalStorage(msg) {
    var linksCnt = msg.links.length;
    for (var i = 0; i < linksCnt; ++i) {
        var linkMsg = msg.links.pop();
        var linkStoreId;

        try {
            linkStoreId = gLinksStorage.addLink(decodeURIComponent(linkMsg.link));
        } catch (e) {
            linkStoreId = gLinksStorage.addLink(linkMsg.link);
        }

        if (linkMsg.linkName !== undefined && $.trim(linkMsg.linkName) !== '') {
            try {
                gLinksStorage.addName(linkStoreId, decodeURIComponent(linkMsg.linkName));
            } catch (e) {
                gLinksStorage.addName(linkStoreId, linkMsg.linkName);
            }
        }

        // Push if suspected to be a good link
        if (utils.isSuspectGoodLink(linkStoreId) === true) {
            gLinksStorage.addSuspectGoodId(linkStoreId);
        }
    }
}
function isMessageEmpty(msg) {
    if (msg.links.length < 1) {
        return true;
    } else {
        return false;
    }
}
function handleEmptyMessage() {
    buildMessageDiv(NO_LINKS_MSG);
}

// Build extension page with links received from content script
function buildThePage(msg) {

    // REFACTORING
    // Content script message should be translated in a single location
    // All other enitities should work with the storage

    try {

        clearDefaultMessage();

        // TODO: display amount of files and a loading progress bar (- \ | /)
        // displayProgressMessage(msg.links.length);

        if (isMessageEmpty(msg) === true) {
            handleEmptyMessage();
            return;
        }

        linksMsgToGlobalStorage(msg);

        buildDelimiter(document.body);
        buildFiltersDiv(document.body);
        buildDelimiter(document.body);
        // this is done especially before building the columns of the links table
        setExtensionPageWidth();

        buildLinksTable(document.body);
        buildDelimiter(document.body);
        buildFooter(document.body);
        setExtensionPageHeight(document.body);
    } catch (e) {
        utils.alertExceptionDetails(e);
    }
}

// Set extension page dimentions
function setExtensionPageHeight() {
    $(document).height(POP_UP_EXT_HEIGHT_MAX);

    if ($(document).height() > POP_UP_EXT_HEIGHT_MAX) {
        $('#' + DOWNLOAD_LIST_DIV_ID).css('overflowY', 'scroll');
        var totalWithoutListHeight = $(document).height() - $('#' + DOWNLOAD_LIST_DIV_ID).height();
        $('#' + DOWNLOAD_LIST_DIV_ID).height(POP_UP_EXT_HEIGHT_MAX - totalWithoutListHeight);
    }
}

function setExtensionPageWidth() {
    $(document.body).width(POP_UP_EXT_WIDTH_MAX - SCROLLER_WIDTH);
}
