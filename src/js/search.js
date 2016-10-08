$(function() {
    var searchNodes = [
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

    var $nodes, link, components, type;
    searchNodes.forEach(function(searchNode) {
        $nodes = $('body').find(searchNode.node);
        $nodes.each(function(idx, node) {
            link = searchNode.urlFunction(node);
            if (link) {
                link = linkFormatter(link);
                components = link.split('.');
                type = components[components.length - 1];
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
