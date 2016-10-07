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

    var links = [],
        fileTypes = [];

    var $nodes, link, components, type;
    searchNodes.forEach(function(searchNode) {
        $nodes = $('body').find(searchNode.node);
        $nodes.each(function(idx, node) {
            link = searchNode.urlFunction(node);
            if (link) {
                links.push(link);
                components = link.split('.');
                type = components[components.length - 1];
                if (!fileTypes.includes(type)) {
                    fileTypes.push(type);
                }
            }
        });
    });

    console.log(links);
    console.log(fileTypes);
});
