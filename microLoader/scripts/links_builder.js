function buildTableHeaderColumn(parentElem, title, className,clmWidth) {
    var elem = document.createElement('th');
    elem.setAttribute('class',className);
    elem.appendChild(document.createTextNode(title));
    elem.setAttribute('width', clmWidth);

    parentElem.appendChild(elem);
}

////////////////////////////////////////////////////////////////////
/// Build links table columns header
function buildLinksTableHeader(parentElem){

    var hdrRow = document.createElement('tr');
    hdrRow.id = LINKS_TBL_HDR_ROW_ID;

    buildTableHeaderColumn(hdrRow,'', 'chkColmnClass');
    buildTableHeaderColumn(hdrRow, 'Full URL', 'linkTableHeaderStyle');
    buildTableHeaderColumn(hdrRow,'Link name', 'linkTableHeaderStyle', gLinksStorage.nameMaxWidth);

    // Header should be at the first row
    if (parentElem.firstChild) {
        parentElem.insertBefore(hdrRow, parentElem.firstChild);
    }
    else {
        parentElem.appendChild(hdrRow);
    }
}

////////////////////////////////////////////////////////////////////
/// Build links table
////////////////////////////////////////////////////////////////////
function setCell(displayText, className) {
    var cell = document.createElement('td');
    cell.setAttribute('class',className);
    cell.appendChild(document.createTextNode(displayText));

    return cell;
}

function buildLinkRow(parentElem, linkId) {

    // Create check box and assign id
    var chkBox = document.createElement('input');
    chkBox.type = "checkbox";
    chkBox.id = linkId;
    chkBox.checked = false;
    chkBox.onclick = function () { onLinkCheck(); };

    // Create row
    var row = document.createElement('tr');
    row.id = LINK_ROW_ELEM_ID_PREFIX + linkId;

    // Fill check box column
    var chkCell = document.createElement('td');
    chkCell.appendChild(chkBox);
    var urlCell = setCell(gLinksStorage.getLink(linkId), 'linksTableCellClass');
    var fileDisplayNameCell = setCell('\u00a0\u00a0\u00a0' + $.trim(gLinksStorage.id2Name[linkId]), 'linksTableCellClass');

    // Fill the row
    row.appendChild(chkCell);
    row.appendChild(urlCell);
    row.appendChild(fileDisplayNameCell);

    // Add row to table
    parentElem.appendChild(row);
}

function buildTableBody(tblBodyElem) {
    var linksAmount = gLinksStorage.getAllLinks().length;
    for (var i = 0; i < linksAmount; i++) {
        // Build a row only in case the link is a file
        if (utils.isSuspectGoodLink(i) === true) {
            buildLinkRow(tblBodyElem, i);
        }
    }
}

function buildLinksTable(parentElem) {
    try {

        // Get links list div
        var downloadListDiv = document.createElement('div');
        downloadListDiv.id = DOWNLOAD_LIST_DIV_ID;

        // Create links table
        var table = document.createElement('table');
        table.id = LINKS_TABLE_ID;
        table.setAttribute('class', DM_FONT_CLASS);
        table.setAttribute('cellpadding','0');
        table.setAttribute('cellspacing', '0');

        var tblBodyElem = document.createElement('tbody');
        tblBodyElem.id = LINKS_TBL_BODY_ID;
        buildLinksTableHeader(tblBodyElem);
        buildTableBody(tblBodyElem);
        table.appendChild(tblBodyElem);

        downloadListDiv.appendChild(table);

        parentElem.appendChild(downloadListDiv);

        // All of the below is done here because only now the table element is appended to the body of the page
        // we can't run this plug-in on a DOM element which is not part of the page

        var linksAmount = gLinksStorage.getAllLinks().length;
        var link;
        for (var i = 0; i < linksAmount; i++) {
            // Place named links first in the table
            if(gLinksStorage.getName(i) === undefined){
                link = $('#'+LINK_ROW_ELEM_ID_PREFIX + i);
                $(link).remove();
                $('#'+LINKS_TABLE_ID).append(link);
            }
        }

        if (tblBodyElem.childElementCount < 2000) { $('#' + LINKS_TABLE_ID).colResizable(COL_RESIZER_ENABLE_PARAM); }

    } catch (e) { utils.alertExceptionDetails(e); }
}

////////////////////////////////////////////////////////////////////
/// Handle 'file size' display filter
////////////////////////////////////////////////////////////////////
var fillSizeRecursionStopFlag = false;
var onDsplFilesSizeCheck = function () {

    if (window.event.srcElement.checked === true) {
        // checked
        fillSizeRecursionStopFlag = false;
        addFileSizeClmn();
        utils.trackCheckbox('on_display_file_size_chk');
    }
    else {
        // unchecked
        fillSizeRecursionStopFlag = true;   // indication for column addition in case it is in the process of fetching
        removeFileSizeClmn();
        utils.trackCheckbox('on_display_file_size_unchk');
    }
};

function fillFileSizeClmnRecurs(id) {
    // recursion stop
    if (id > gLinksStorage.length() || fillSizeRecursionStopFlag === true) {
        fillSizeRecursionStopFlag = false;
        return;
    }

    if (gLinksStorage.getSize(id) !== undefined) {
        if (fillSizeRecursionStopFlag === false) buildSizeCell(id, gLinksStorage.getSize(id));
        setTimeout(function () { fillFileSizeClmnRecurs(++id); }, 1);
    } else if (utils.isExtensionLegal(utils.getExtensionFromUrl(gLinksStorage.getLink(id)))) {

        // read HTTP header of the URL
        $.ajax({
            type: "HEAD",
            async: true,
            url: gLinksStorage.getLink(id),
            success: function (message, text, response) {
                var fileSize = response.getResponseHeader('Content-Length');
                if(fileSize === null || fileSize === undefined) fileSize = BAD_SIZE_STRING;
                gLinksStorage.addSize(id, fileSize);

                if (fillSizeRecursionStopFlag === false) buildSizeCell(id, fileSize);
                setTimeout(function () { fillFileSizeClmnRecurs(++id); }, 1);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                gLinksStorage.addSize(id, BAD_SIZE_STRING);

                if (fillSizeRecursionStopFlag === false) buildSizeCell(id, null);
                setTimeout(function () { fillFileSizeClmnRecurs(++id); }, 1);
            }
        });
    } else {
        setTimeout(function () { fillFileSizeClmnRecurs(++id); }, 1);
    }
}
function buildSizeCell(id, fileSize) {
    var fileSizeStr;

    if (fileSize === null) {
        fileSizeStr = 'N/A';
    }
    else if ((fileSize / 1048576).toFixed(2) == '0.00') {
        fileSizeStr = (fileSize / 1024).toFixed(2) + ' kB';
    }
    else {
        fileSizeStr = (fileSize / 1048576).toFixed(2) + ' MB';
    }

    var sizeCellElem = setCell('\u00a0\u00a0\u00a0' + fileSizeStr, 'linksTableCellClass');
    $('#' + LINK_ROW_ELEM_ID_PREFIX + id).append(sizeCellElem);
}

function addFileSizeClmn() {

    $('#' + LINKS_TABLE_ID).colResizable(COL_RESIZER_DISABLE_PARAM);    // disable col resizer effect
    $('#' + LINKS_TBL_HDR_ROW_ID).remove();                             // remove table header
    buildLinksTableHeader($('#' + LINKS_TBL_BODY_ID)[0]);               // build table header
    buildTableHeaderColumn($('#' + LINKS_TBL_HDR_ROW_ID)[0], 'File size', 'linkTableHeaderStyle', LINKS_FILE_SIZE_CLMN_WIDTH);   // add the file size column

    setTimeout(function () { fillFileSizeClmnRecurs(0); }, 1);

    $('#' + LINKS_TABLE_ID).colResizable(COL_RESIZER_ENABLE_PARAM);     // enable col resizer effect
}

function removeFileSizeClmn() {
    $('#' + LINKS_TABLE_ID).colResizable(COL_RESIZER_DISABLE_PARAM);        // disable col resizer effect

    $('#' + LINKS_TBL_HDR_ROW_ID + ' th:last-child').remove();              // remove the last column which is the file size column

    for (var i = 0; i < gLinksStorage.length(); ++i) {                     // remove all the size column cells

        if ($('#' + LINK_ROW_ELEM_ID_PREFIX + i).children().length == 3) continue;    // in case user closed size column while getting sizes, to avoid overrun of the delition

        $('#' + LINK_ROW_ELEM_ID_PREFIX + i + ' td:last-child').remove();
    }

    $('#' + LINKS_TABLE_ID).colResizable(COL_RESIZER_ENABLE_PARAM);         // enable col resizer effect
}
