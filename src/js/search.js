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

    var $nodes, link, components, type;
    searchNodes.forEach(function(searchNode) {
        $nodes = $('body').find(searchNode.node);
        $nodes.each(function(idx, node) {
            link = searchNode.urlFunction(node);
            if (link) {
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
        event: EVENT_LINKS_FOUND,
        files: files,
        types: types
    });
});
