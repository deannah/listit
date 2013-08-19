// dhbroadcaster.js - DeannaTest's module
// author: deannah

var { Cc, Cu, Ci } = require('chrome');
var WindowMediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

exports.setupBroadcaster = function(options) {

    var window = WindowMediator.getMostRecentWindow("navigator:browser");
    var document = window.document;

    var id = options.id || "defaultID";
    var label = options.label || "defaultLabel";
    var sbclass = options.sbclass || "defaultClass";
    var url = options.sidebarurl || "about:blank";
    var title = options.sidebartitle || "defaultTitle";

    var broadcaster = document.createElement('broadcaster');
    broadcaster.setAttribute("class", sbclass);
    broadcaster.setAttribute("id", id);
    broadcaster.setAttribute("label", label);
    broadcaster.setAttribute("type", "checkbox");
    broadcaster.setAttribute("autoCheck", "false");
    broadcaster.setAttribute("group", "sidebar");
    broadcaster.setAttribute("sidebarurl", url);
    broadcaster.setAttribute("sidebartitle", title);
    broadcaster.setAttribute("oncommand", "toggleSidebar('" + id + "')");
    
    var broadcasters = document.getElementById('mainBroadcasterSet');
    broadcasters.appendChild(broadcaster);
    
    return id;
};
