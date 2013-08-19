// dhsidebar.js - DeannaTest's module
// author: deannah

var { Cc, Cu, Ci } = require('chrome');
var WindowUtils = require('window-utils');
var WindowMediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

exports.createSidebar = function(options) {
    var sidebar = {};
    var title = options.title || "";
    var url = options.url || "about:blank";

    sidebar.show = function() {
        console.log("hi there: " + title);
    };

    sidebar.toggle = function(id) {
        var window = WindowMediator.getMostRecentWindow("navigator:browser");
        window.toggleSidebar(id);
    };
    
    sidebar.destroy = function() {};
    
    return sidebar;
};

