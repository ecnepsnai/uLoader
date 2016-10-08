$(function() {
    var supportedTypes = [
        '.au', '.avi', '.bmp', '.bz2', '.css', '.dtd', '.doc', '.docx', '.dotx', '.es',
        '.exe', '.gif', '.gz', '.hqx', '.jar', '.jpg', '.js', '.midi', '.mp3',
        '.mpeg', '.ogg', '.pdf', '.pl', '.png', '.potx', '.ppsx', '.ppt', '.pptx',
        '.ps', '.qt', '.ra', '.ram', '.rdf', '.rtf', '.sgml', '.sit', '.sldx', '.svg',
        '.swf', '.tar.gz', '.tgz', '.tiff', '.tsv', '.txt', '.wav', '.webm', '.webp',
        '.xlam', '.xls', '.xlsb', '.xlsx', '.xltx', '.xml', '.zip'
    ];

    var searchNodes = [
        {
            node: 'a',
            urlFunction: function(node) {
                return $(node).attr('href');
            }
        },
        {
            node: 'img',
            urlFunction: function(node) {
                return $(node).attr('src');
            }
        },
        {
            node: 'video',
            urlFunction: function(node) {
                return $(node).attr('src');
            }
        }
    ];

    var files = [],
        types = [];

    var linkFormatter = function(link) {
        if (link.indexOf('//') === 0) {
            link = document.location.protocol + link;
        } else if (link.indexOf('http') !== 0) {
            link = document.location.origin + link;
        }

        return link;
    };

    var linkFilter = function(link) {
        var valid = false;
        supportedTypes.forEach(function(type) {
            if (link.endsWith(type)) {
                valid = true;
            }
        });
        return valid;
    };

    var typeFormatter = function(link) {
        var components = link.split('.');
        if (components.length > 0 && link.indexOf('.') !== -1) {
            var type = components[components.length - 1];
            return type;
        }
    };

    var $nodes, link, components, type;
    searchNodes.forEach(function(searchNode) {
        $nodes = $('body').find(searchNode.node);
        $nodes.each(function(idx, node) {
            link = searchNode.urlFunction(node);
            if (link && linkFilter(link)) {
                link = linkFormatter(link);
                type = typeFormatter(link);
                files.push({
                    url: link,
                    type: type
                });
                if (!types.includes(type)) {
                    types.push(type);
                }
            }
        });
    });

    chrome.runtime.sendMessage({
        event: 'uLoader-links-found',
        files: files,
        types: types
    });
});
