// On link checkbox check
function onLinkCheck() {
    // Link checked
    if (window.event.srcElement.checked === true) {
        selectLink(window.event.srcElement.id);
    } else { // Link unchecked
        unselectLink(window.event.srcElement.id);
    }
}

// Change link checkbox state
function selectLink(linkId) {
    $('#' + linkId).attr('checked', true); // check the link
    changeLinkColor(linkId, SELECTED_LINK_COLOR);
    moveLinkToTop(linkId);
}

function unselectLink(linkId) {
    $('#' + linkId).attr('checked', false); // uncheck link
    changeLinkColor(linkId, UNSELECTED_LINK_COLOR);
    moveLinkToBottom(linkId);
}

function changeLinkColor(linkId, color) {
    $('#' + LINK_ROW_ELEM_ID_PREFIX + linkId).css('backgroundColor', color);
}

function moveLinkToTop(linkId) {
    var link = $('#' + LINK_ROW_ELEM_ID_PREFIX + linkId);
    $(link).remove();
    $(link).insertAfter($('#' + LINKS_TBL_HDR_ROW_ID));
}

function moveLinkToBottom(linkId) {
    var link = $('#' + LINK_ROW_ELEM_ID_PREFIX + linkId);
    $(link).remove();
    $('#' + LINKS_TABLE_ID).append(link);
}

function unselectAllLinks() {
    gLinksStorage.getAllIds().forEach(function(id) {
        unselectLink(id);
    });
}

// Hide irelevant links on filter activation
var onFilterCheck = function() {
    try {
        clearCustomFilter();
        gLinksStorage.getIds(window.event.srcElement.name).forEach(function(link) {
            // Filter checked
            if (window.event.srcElement.checked === true) {
                selectLink(link);
            } else { // Filter unchecked
                unselectLink(link);
            }
        });
    }
    catch (exc) {
        utils.alertExceptionDetails(exc);
    }
};

// Master filter sets\unsets all other filters
var onMasterFilterCheck = function() {
    try {
        gLinksStorage.getExtensions().forEach(function(extension) {
            document.getElementsByName(extension)[0].checked = window.event.srcElement.checked;

            window.event.srcElement.name = extension;
            onFilterCheck();
        });

    } catch (e) { utils.alertExceptionDetails(e); }
};

// Handle hide irrelevant
var onShowAllLinksClick = function() {
    if (window.event.srcElement.checked === true) {
        // checked
        displayAllLinks();
        utils.trackCheckbox(GA_ON_CHK_DISPLAY_ALL_LINKS);
    } else {
        // unchecked
        hideIrelevantLinks();
        utils.trackCheckbox(GA_ON_UNCHK_DISPLAY_ALL_LINKS);
    }
};

function displayAllLinks() {
    gLinksStorage.getAllLinks().forEach(function(link) {
        if (utils.isSuspectGoodLink(link) === false) {
            // TODO: need a way to identify the source of this function (file, namespace, prototype) , use namespace e.g. var builder = {};
            // the [0] is conversion from jquery selector to DOM elelment
            buildLinkRow($('#' + LINKS_TBL_BODY_ID)[0], link);
        }
    });

    // TODO: need a way to identify the source of this function (file, namespace, prototype)  , use namespace e.g. var builder = {};
    setExtensionPageHeight(document.body);
}

function hideIrelevantLinks() {
    gLinksStorage.getAllLinks().forEach(function(link) {
        if (utils.isSuspectGoodLink(link) === false) {
            $('#' + LINK_ROW_ELEM_ID_PREFIX + link).remove();
        }
    });
}

// Custom filter
function applyCustomFilter() {
    var filterStr = window.event.srcElement.value.toLowerCase();

    // uncheck all file extensions filters
    var extFilters = document.getElementById(EXT_FILTERS_DIV_ID).getElementsByTagName('input');
    extFilters.forEach(function(filter) {
        filter.checked = false;
    });

    // Uncheck on empty filter string
    if ($.trim(filterStr) === '') {
        unselectAllLinks();
        return;
    }

    // search string might be a regular expression
    var match, regex;
    try {
        match = filterStr.match(new RegExp('^/(.*?)/(g?i?m?y?)$'));
        if (match !== null) {
            regex = new RegExp(match[1], match[2]);
        }
    } catch (exc) {
        utils.alertExceptionDetails(exc);
    }

    var fullLinkRegex = function(idx) {
        return match !== undefined && regex !== undefined && regex.test(gLinksStorage.getLink(idx).toLowerCase());
    };

    var stringInFullLink = function(idy) {
        return gLinksStorage.getLink(idy).toLowerCase().indexOf(filterStr) !== -1;
    };

    // apply filter string
    for (var i = gLinksStorage.length() - 1; i >= 0; i--) {
        if (stringInFullLink(i) || fullLinkRegex(i) || gLinksStorage.getName(i) !== undefined &&
            (stringInFullLink(i) || fullLinkRegex(i))) {
            selectLink(i);
        } else {
            unselectLink(i);
        }
    }
}

function clearCustomFilter() {
    // Check if custom filter exists
    if (document.getElementById(CUSTOM_FILTER_INPUT_ID) === undefined) {
        return;
    }

    if (document.getElementById(CUSTOM_FILTER_INPUT_ID).value !== '') {
        unselectAllLinks();
    }
    document.getElementById(CUSTOM_FILTER_INPUT_ID).value = '';
}

function onDownloadClick() {
    try {
        // Get all checked links
        var checkedLinks = [];

        document.getElementsByTagName('input').forEach(function(input) {
            if (input.type == 'checkbox' && input.id !== '' && input.checked) {
                var linkId = input.id.toString().replace(LINK_ROW_ELEM_ID_PREFIX, '');
                checkedLinks.push(gLinksStorage.getLink(linkId));
            }
        });

        // Don't send message with empty list
        if (checkedLinks.length < 1) {
            return;
        }

        // Send checked links to content script
        gContentConnectionPort.postMessage({
            downloadFilesArr: checkedLinks,
            downloadFilesArrLen: checkedLinks.length
        });

    } catch (exc) {
        utils.alertExceptionDetails(exc);
    }
}
