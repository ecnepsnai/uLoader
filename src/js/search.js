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
            return node.attributes.getNamedItem('href').value;
        }
    },
    {
        node: 'img',
        urlFunction: function(node) {
            return node.attributes.getNamedItem('src').value;
        }
    },
    {
        node: 'video',
        urlFunction: function(node) {
            return node.attributes.getNamedItem('src').value;
        }
    },
    {
        node: 'embed',
        urlFunction: function(node) {
            return node.attributes.getNamedItem('src').value;
        }
    }
];

var files = [],
    types = [],
    filesByURL = {};

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

var nodes, link, components, type;
searchNodes.forEach(function(searchNode) {
    nodes = document.getElementsByTagName(searchNode.node);
    for (var i = 0, count = nodes.length; i < count; i++) {
        var node = nodes[i];

        link = searchNode.urlFunction(node);
        if (link === undefined || !linkFilter(link)) {
            return;
        }

        link = linkFormatter(link);
        if (!filesByURL[link]) {
            link = linkFormatter(link);
            type = typeFormatter(link);
            files.push({
                url: link,
                type: type
            });
            filesByURL[link] = true;
            if (!types.includes(type)) {
                types.push(type);
            }
        }
    }
});

chrome.runtime.sendMessage({
    event: 'uLoader-links-found',
    files: files,
    types: types
});