/*
This script runs in the context of the active page.
It sends back to the extension a list of all links present in the hosting DOM.
It receives from the extension a list of links to download
*/

// Open connection with extension script
var port = chrome.extension.connect({ name: 'content-extension' });

// Assign listener to messages from extension
port.onMessage.addListener(downloadFiles);

// Get download file name from link
function getDownloadFileName(link) {
    var downloadFileName = utils.getFileName(link);
    if (downloadFileName === '') {
        downloadFileName = 'download.download';
    }

    return downloadFileName;
}

// Handle download file link hides in html
function getDownloadFileLink(link) {
    var downloadFileName = utils.getFileName(link);

    // Same link in case of no file
    if (downloadFileName === '') {
        return link;
    }

    // Same link in case of requested file is html
    if (utils.getExtensionFromName(downloadFileName) == 'html') {
        return link;
    }

    return link;
}

// Extension messages handler
function downloadFiles(msg) {

    // Download files
    msg.downloadFilesArr.forEach(function(file) {
        try {
            // Create hidden download hyperlink
            var downloadFileHyperLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            downloadFileHyperLink.href = getDownloadFileLink(file);
            downloadFileHyperLink.download = getDownloadFileName(
                decodeURI(downloadFileHyperLink.href)); // thanks Hohwan Park :)

            // Create mouse click event
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent(
                'click', true, false, self, 0, 0, 0, 0, 0,
                false, false, false, false, 0, null
            );

            // Trigger mouse click event on download hyperlink
            downloadFileHyperLink.dispatchEvent(event);
        } catch (exc) {
            utils.alertExceptionDetails(exc);
        }
    });
}

// Get all links on the active page
function retreiveDownloadableFiles() {
    try {
        var downlaodableFilesList = [];

        // Retrive all links
        var linkCount = document.links.length;
        for (var i = linkCount - 1; i >= 0; i--) {
            // Don't add empty links
            if ($.trim(document.links[i].toString()) === '') {
                return;
            }

            downlaodableFilesList.push({
                link: document.links[i].toString(),
                linkName: $.trim($(document.links[i]).text())
            });
        }

        // Send links list to whom listens e.g. extension page
        port.postMessage({ links: downlaodableFilesList });
    } catch (exc) {
        utils.alertExceptionDetails(exc);
    }
}

// Call the retreive function on script load
retreiveDownloadableFiles();
