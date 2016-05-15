// Append download button and path input to given element
function appendDownloadElements(parentElement) {
    try {
        var downloadElemsDiv = document.createElement('div');

        // Add download button
        var buttonElm = document.createElement('button');
        buttonElm.setAttribute('class', DM_FONT_CLASS);
        buttonElm.type = 'button';
        buttonElm.innerHTML = 'Download';
        buttonElm.onclick = function() { onDownloadClick(this); };
        downloadElemsDiv.appendChild(buttonElm);

        parentElement.appendChild(downloadElemsDiv);

    } catch (e) {
        utils.alertExceptionDetails(e);
    }
}

// Build footer
function buildFooter(parentElem) {

    var footerDiv = document.createElement('div');
    footerDiv.id = FOOTER_DIV_ID;

    var btnDiv = document.createElement('div');
    btnDiv.align = 'left';
    appendDownloadElements(btnDiv);

    var leftClm = document.createElement('td');
    leftClm.appendChild(btnDiv);

    var row = document.createElement('tr');
    row.appendChild(leftClm);

    var table = document.createElement('table');
    table.width = '100%';
    table.cellspacing = '0';
    table.cellpadding = '0';
    table.border = '0';
    table.appendChild(row);

    footerDiv.appendChild(table);

    parentElem.appendChild(footerDiv);
}

