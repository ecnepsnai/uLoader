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

    class Filter {
        constructor(matching, types) {
            this.matching = matching;
            this.types = types;
        }

        matches(file) {
            var matched = false;

            if (this.matching !== undefined) {
                if (file.url.match(this.matching) !== null) {
                    matched = true;
                } else {
                    matched = false;
                }
            }
            if (!this.noTypes()) {
                if (currentFilter.types[file.type]) {
                    matched = true;
                } else {
                    matched = false;
                }
            }

            return matched;
        }

        noTypes() {
            if (this.types === {}) {
                return true;
            }
            var allTypes = Object.values(this.types);
            for (var i = 0; i < allTypes.length; i++) {
                if (allTypes[i] !== false) {
                    return false;
                }
            }

            return true;
        }
    }

    var files = [],
        currentFilter = new Filter(undefined, {}),
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
                currentFilter.matching = expression;
                filterFiles();
            } catch (e) {
                // Don't worry about it
            }
        } else {
            currentFilter.matching = undefined;
            filterFiles();
        }
    }));

    var addFilter = function(filter) {
        var $checkbox = $('<input type="checkbox" />'),
            $label = $('<label></label>');
        $checkbox.on('click', function() {
            currentFilter.types[filter] = this.checked;
            filterFiles();
        });
        $label.append($checkbox).append($('<span>' + filter + '</span>'));
        $filters.append($label);
    };

    var filterFiles = function() {
        var matchedCount = 0;
        files.forEach(function(file, idx) {
            if (currentFilter.matches(file)) {
                matchedCount ++;
                file.download = true;
                $('#file-' + idx).prop('checked', file.download);
            } else {
                file.download = false;
                $('#file-' + idx).prop('checked', file.download);
            }
        });
        updateButton();
    };

    var updateButton = function() {
        var numFilesToDownload = 0;
        files.forEach(function(file) {
            if (file.download) {
                numFilesToDownload ++;
            }
        });

        if (numFilesToDownload > 0) {
            $downloadButton.attr('disabled', false);
            $downloadButton.text('Download Files (' + numFilesToDownload + ')');
        } else {
            $downloadButton.attr('disabled', true);
            $downloadButton.text('Download Files');
        }
    }

    var addFileCheckbox = function(file, idx) {
        var $checkbox = $('<input type="checkbox" id="file-' + idx + '"/>');
        $checkbox.on('click', function() {
            file.download = this.checked;
            updateButton();
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
        }
    });
});
