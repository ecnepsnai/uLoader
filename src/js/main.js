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

    var files = [],
        $filters = $('#filters'),
        $files = $('#files'),
        $downloadButton = $('#download');

    $downloadButton.attr('enabled', 'disabled');
    $downloadButton.on('click', function() {
        files.forEach(function(file) {
            if (file.download) {
                chrome.runtime.sendMessage({
                    event: 'uLoader-download-file',
                    url: file.url
                });
            }
        });
    });

    var addFilter = function(filter) {
        var $checkbox = $('<input type="checkbox" />'),
            $label = $('<label></label>');
        $checkbox.on('click', function() {
            files.forEach(function(file, idx) {
                if (file.type === filter) {
                    file.download = true;
                    $('#file-' + idx).click();
                }
            });
        });
        $label.append($checkbox).append($('<span>' + filter + '</span>'));
        $filters.append($label);
    };

    var addFileCheckbox = function(file, idx) {
        var $checkbox = $('<input type="checkbox" id="file-' + idx + '"/>');
        $checkbox.on('click', function() {
            file.download = true;
        });
        return $checkbox;
    };

    var addFile = function(file, idx) {
        var $checkboxTd = $('<td class="checkbox"></td>'),
            $checkbox = addFileCheckbox(file, idx),
            $tr = $('<tr></tr>'),
            $fileTd = $('<td class="url">' + file.url + '</td><td class="type">' + file.type + '</td>');
        $checkboxTd.append($checkbox);
        $tr.append($checkboxTd).append($fileTd);
        $files.append($tr);
    };

    chrome.runtime.onMessage.addListener(function(message) {
        if (message.event === 'uLoader-links-found') {
            message.types.forEach(function(type) {
                addFilter(type);
            });
            files = message.files;
            files.forEach(function(file, idx) {
                addFile(file, idx);
            });
            $downloadButton.attr('enabled', 'enabled');
        }
    });
});
