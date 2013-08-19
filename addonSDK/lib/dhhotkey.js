// dhhotkey.js - DeannaTest's module
// author: deannah

var { Cc, Cu, Ci } = require('chrome');
var WindowMediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

exports.setupHotkey = function(options) {
    
    //unclear whether or not this should be in a trycatch block
    var window = WindowMediator.getMostRecentWindow("navigator:browser");
    var document = window.document;
    
    var keysid = options.keysid || "defaultKeysID";
    var id = options.id || "defaultID";
    var hkclass = options.hkclass || "defaultClass";
    var command = options.command;
    
    var hotkeys = document.createElement('keyset');
    hotkeys.setAttribute("id", keysid);
    hotkeys.setAttribute("class", hkclass);
    
    var openHotkey = document.createElement('key');
    openHotkey.setAttribute("id", id);
    openHotkey.setAttribute("class", hkclass);
    openHotkey.setAttribute("command", command);
    openHotkey.setAttribute("oncommand", function() {
        console.log("hi hi hi hotkeys yay");
        // is this ever getting called.
    });
    //here I'm just having it toggle by doing command. >currently nonfunctional WOOOO.
    // but in the future we should mimic current code and focus/toggle.
    
    openHotkey.setAttribute("keytext", "X");
    openHotkey.setAttribute("modifiers", "control shift");
    // should use accel rather than control but it's nonfunctional anyway
    openHotkey.setAttribute("key", "X");
    
    hotkeys.appendChild(openHotkey);
    document.documentElement.appendChild(hotkeys);

    return id;
};
