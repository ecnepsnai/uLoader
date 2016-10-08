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
        var $filter = $('<label><input type="checkbox" /> ' + filter + '</label>');
        $filters.append($filter);
    };

    var addFileCheckbox = function(file) {
        var $checkbox = $('<input type="checkbox" />');
        $checkbox.on('click', function() {
            file.download = true;
        });
        return $checkbox;
    };

    var addFile = function(file) {
        var $checkboxTd = $('<td></td>'),
            $checkbox = addFileCheckbox(file),
            $tr = $('<tr></tr>'),
            $fileTd = $('<td>' + file.url + '</td><td>' + file.type + '</td>');
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
            files.forEach(function(file) {
                addFile(file);
            });
            $downloadButton.attr('enabled', 'enabled');
        }
    });
});
