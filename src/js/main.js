$(function() {
    var injectedFiles = [
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
        $downloadButton = $('#download'),
        $textFilter = $('.text-filter');

    $downloadButton.prop('disabled', true);
    $downloadButton.on('click', function() {
        var downloadFiles = files.filter(function(file) {
            return file.download;
        });

        if (downloadFiles && downloadFiles.length > 0) {
            chrome.runtime.sendMessage({
                event: 'uLoader-download-files',
                files: downloadFiles
            });
        }
    });

    $textFilter.on('input', $.debounce(250, function() {
        var text = $textFilter.val();
        if (text.length > 0) {
            try {
                var expression = new RegExp(text, 'g');
                files.forEach(function(file, idx) {
                    if (file.url.match(expression) !== null) {
                        file.download = true;
                    } else {
                        file.download = false;
                    }
                    $('#file-' + idx).prop('checked', file.download);
                });
            } catch (e) {
                // Don't worry about it
            }
        } else {
            files.forEach(function(file, idx) {
                file.download = false;
                $('#file-' + idx).prop('checked', file.download);
            });
        }
    }));

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

            if (files.length > 0) {
                $downloadButton.prop('disabled', false);
            }
        }
    });
});
