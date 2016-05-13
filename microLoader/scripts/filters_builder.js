////////////////////////////////////////////////////////////////////
/// Build extension page with links received from content script
////////////////////////////////////////////////////////////////////
function buildFilterDescClmn(parentElem, className, title) {
    var descColmn = document.createElement('td');
    descColmn.setAttribute('class', className);
    descColmn.appendChild(document.createTextNode(title));
    parentElem.appendChild(descColmn);
}

function buildCheckbox(parentElem, text, onClickCallback) {
    var input = document.createElement('input');
    input.type = "checkbox";
    input.name = text;
    input.checked = false;
    input.onclick = onClickCallback;

    parentElem.appendChild(document.createTextNode(text));
    parentElem.appendChild(input);
    parentElem.appendChild(document.createTextNode('\u00a0'));
    parentElem.appendChild(document.createTextNode('\u00a0'));
}

function buildExtFilterRow(parentElem) {
    // Filters div
    var extFilterDiv = document.createElement('div');
    extFilterDiv.id = EXT_FILTERS_DIV_ID;

    // Add filters checkboxes
    var extensionsArr = gLinksStorage.getExtensions();
    for (var i = 0; i < extensionsArr.length; ++i) {
        buildCheckbox(extFilterDiv, extensionsArr[i], onFilterCheck);
    }

    // Add master filter only in case there are more than one filters
    if (extFilterDiv.childNodes.length > 2) {
        buildCheckbox(extFilterDiv, 'All', onMasterFilterCheck);
    }

    var row = document.createElement('tr');

    buildFilterDescClmn(row, 'filterDescClass', "Extension filters:");

    var fltrClmn = document.createElement('td');
    fltrClmn.appendChild(extFilterDiv);
    row.appendChild(fltrClmn);
    parentElem.appendChild(row);
}

function buildCustomFilterRow(parentElem) {

    // Custom filter div
    var cstmFilterDiv = document.createElement('div');

    // Build custom text filter
    var customTextFilter = document.createElement('input');
    customTextFilter.type = "textbox";
    customTextFilter.autofocus = "autofocus";
    customTextFilter.id = CUSTOM_FILTER_INPUT_ID;
    customTextFilter.setAttribute('class', DM_FONT_CLASS);
    customTextFilter.onkeyup = function () { applyCustomFilter(); };

    cstmFilterDiv.appendChild(customTextFilter);

    var row = document.createElement('tr');

    buildFilterDescClmn(row, 'filterDescClass', CUSTOM_FILTER_TITLE);

    var srchClmn = document.createElement('td');
    srchClmn.appendChild(cstmFilterDiv);
    row.appendChild(srchClmn);

    parentElem.appendChild(row);
}

function buildDsplFilterRow(parentElem) {
    var row = document.createElement('tr');

    buildFilterDescClmn(row, 'filterDescClass', FILTER_DISPLAY_OPTIONS_TITLE);

    var dsplFilterDiv = document.createElement('div');

    buildCheckbox(dsplFilterDiv, SHOW_ALL_LINKS_FILTER_TITLE, onShowAllLinksClick);
    buildCheckbox(dsplFilterDiv, SHOW_FILE_SIZE_FILTER_TITLE, onDsplFilesSizeCheck);

    var dsplFilterClmn = document.createElement('td');
    dsplFilterClmn.appendChild(dsplFilterDiv);
    row.appendChild(dsplFilterDiv);

    parentElem.appendChild(row);
}

function buildFiltersDiv(parentElem) {
    try {

        // Build the table
        var table = document.createElement('table');
        table.width = "97%";
        table.cellspacing = "0";
        table.cellpadding = "0";
        table.border = "0";
        table.setAttribute('class',DM_FONT_CLASS);

        buildExtFilterRow(table); // Build first row of filter by file extension

        buildCustomFilterRow(table); // Build second row of custom filter

        buildDsplFilterRow(table); // build display filter row

        // Set filter div
        var downloadFilterDiv = document.createElement('div');
        downloadFilterDiv.id = DOWNLOAD_FILTER_DIV_ID;
        downloadFilterDiv.appendChild(table);

        parentElem.appendChild(downloadFilterDiv);

    } catch (e) { utils.alertExceptionDetails(e); }
}
