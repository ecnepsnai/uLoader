///////////////////////////////////////////////////////////
// Contructor
///////////////////////////////////////////////////////////
function LinksStorage() {
    this.ext2ids = [];
    this.id2link = [];
    this.id2Name = [];
    this.id2Size = [];
    this.sizableIds = [];
    this.id = -1;
    this.nameMaxWidth = 0;
}


///////////////////////////////////////////////////////////
// manage size
///////////////////////////////////////////////////////////
LinksStorage.prototype.addSuspectGoodId = function (id) {
    this.sizableIds.push(id);
};
LinksStorage.prototype.getSuspectGoodIds = function () {
    return this.sizableIds;
};
LinksStorage.prototype.addSize = function (id, size) {
    this.id2Size[id] = size;
};
LinksStorage.prototype.getSize = function (id) {
    return this.id2Size[id];
};

///////////////////////////////////////////////////////////
// manage names
///////////////////////////////////////////////////////////
LinksStorage.prototype.addName = function (id, name) {

    if (name === undefined) return;

    this.id2Name[id] = name;

    var s = document.createElement('span'); $(s).html(name); $('body').append(s);
    if (utils.isSuspectGoodLink(id) && $(s).width() > this.nameMaxWidth) {
        this.nameMaxWidth = $(s).width();
    }

    $(s).remove();
};

LinksStorage.prototype.getName = function (id) {
    return this.id2Name[id];
};

///////////////////////////////////////////////////////////
// Add link (filter and sort)
///////////////////////////////////////////////////////////
LinksStorage.prototype.addLink = function (link) {
    try {

        // Validate extension
        var extension = utils.getExtensionFromUrl(link);
        if (utils.isExtensionLegal(extension) === false) {
            extension = "unknown";
        }

        // Create ids array for extension
        if (typeof this.ext2ids[extension] == 'undefined') {
            this.ext2ids[extension] = [];
        }

        // TODO: refactor to make more time efficient
        // Check if link exists
        for (var i = 0; i < this.ext2ids[extension].length; ++i) {
            if (this.id2link[this.ext2ids[extension][i]] == link) {
                return;
            }
        }

        // Create unique id
        this.id++;

        // Push to DB
        this.ext2ids[extension].push(this.id);
        this.id2link[this.id] = link;

        return this.id;

    } catch (e) { utils.alertExceptionDetails(e); }
};

///////////////////////////////////////////////////////////
// Return Array<id,link>
///////////////////////////////////////////////////////////
LinksStorage.prototype.getAllLinks = function () {
    try {
        var allLinks = [];

        // TODO: refactor to make more time efficient
        var extArr = this.getExtensions();
        for (var i = 0; i < extArr.length; ++i) {
            var idArr = this.ext2ids[extArr[i]];
            for (var j = 0; j < idArr.length; ++j) {
                allLinks[idArr[j]] = this.id2link[idArr[j]];
            }
        }

        return allLinks;
    }
    catch (exc) {
        utils.alertExceptionDetails(exc);
    }
};

///////////////////////////////////////////////////////////
// Return Array<id,link>
///////////////////////////////////////////////////////////
LinksStorage.prototype.getAllIds = function () {
    try {
        var allIds = [];

        // TODO: refactor to make more time efficient
        var extArr = this.getExtensions();
        for (var i = 0; i < extArr.length; ++i) {
            var idArr = this.ext2ids[extArr[i]];
            for (var j = 0; j < idArr.length; ++j) {
                allIds.push(idArr[j]);
            }
        }

        return allIds;
    }
    catch (exc) {
        utils.alertExceptionDetails(exc);
    }
};

///////////////////////////////////////////////////////////
// Return Array<extensions>
///////////////////////////////////////////////////////////
LinksStorage.prototype.getExtensions = function () {
    var extArr = [];

    for (var extension in this.ext2ids) {
        extArr.push(extension);
    }

    return extArr;
};

///////////////////////////////////////////////////////////
// Return Array<id,link>
///////////////////////////////////////////////////////////
LinksStorage.prototype.getIds = function (extension) {
    return this.ext2ids[extension];
};

///////////////////////////////////////////////////////////
// Misc
///////////////////////////////////////////////////////////
LinksStorage.prototype.getLink = function (id) {
    return this.id2link[id];
};

LinksStorage.prototype.length = function () {
    return this.id;
};
