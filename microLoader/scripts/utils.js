var utils = {};  // Declare namespace

// Given exception object, alert all it's details
utils.alertExceptionDetails = function(exc) {
    console.error(exc);
};

// Given file path, return it's name
utils.getFileName = function(filePath) {
    try {

        var fileName = '';
        var match = null;

        if (typeof filePath != 'undefined' && filePath.length > 0) {
            match = filePath.match(/\/[^\\\/\:\*\?\"<>|]*\.[^\\\.\/\:\*\?\"<>|]*$/);
        }
        if (match !== null) {
            fileName = match[0].substring(1, match[0].length);
        }

        return fileName;

    } catch (e) {utils.alertExceptionDetails(e);}
};

// Given file name, return it's extension
utils.getExtensionFromName = function(fileName) {

    try {

        var fileExt = '';
        var lastDotIndex = -1;

        if (typeof fileName != 'undefined' && fileName.length > 0) {
            lastDotIndex = fileName.lastIndexOf('.');
        }
        if (lastDotIndex > -1) {
            fileExt = fileName.substr(lastDotIndex + 1, fileName.length - lastDotIndex - 1);
        }

        return fileExt.toLowerCase();
    } catch (e) { utils.alertExceptionDetails(e); }
};

// Given file path, return it's extension
utils.getExtensionFromUrl = function(filePath) {
    return utils.getExtensionFromName(utils.getFileName(filePath));
};

// Decide whether this link is good for user to download
utils.isSuspectGoodLink = function(linkId) {

    // no valid file name (the shortest file name is x.x)
    if (utils.getFileName(gLinksStorage.getLink(linkId)).length < 3 ||
        // extension not legal
        utils.isExtensionLegal(utils.getExtensionFromUrl(gLinksStorage.getLink(linkId))) === false) {
        return false;
    } else {
        return true;
    }
};

// Return true if given string is valid file extension
utils.isExtensionLegal = function(extension) {

    var patt = new RegExp('[a-z,0-9]{' + extension.length + '}$', 'i');

    if (extension.length > 0 &&
        extension.length < 5 &&
        patt.test(extension) &&
        isNaN(extension) === true) {
        return true;
    }
    return false;
};

function PRINT_LOG(log) {
    if (DEBUG === false) {
        return;
    }

    // http://getfirebug.com/logging
    console.log(PRINT_LOG.caller.name + ': ' + log);
}
