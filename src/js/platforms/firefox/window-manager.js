/*jshint globalstrict: true*/
/*exported EXPORTED_SYMBOLS, ListItWM*/
/*globals Components: false, ListIt: true*/
/**
 * This module handles the setup/teardown of windows.
 *
 * I can't do this in XUL because (a) this is a bootstrapped extension and (b)
 * I need to be able to change things on the fly.
 *
 **/

'use strict';

var EXPORTED_SYMBOLS = ["ListItWM"];


var SIDEBAR_URL = "chrome://listit/content/extension/sidebar.xul";
var Cc = Components.classes,
    Ci = Components.interfaces,
    Cu = Components.utils;

var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
         .getService(Ci.nsIWindowMediator),
    ListIt,
    ListItWM = {};

var eachWindow = function(fn) {
  var windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    var domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    fn.call(domWindow, domWindow);
  }
};

var setupBroadcaster = function(window) {
  var document = window.document;
  var broadcasters = document.getElementById('mainBroadcasterSet');
  var broadcaster = document.createElement('broadcaster');
  broadcaster.classList.add("listit");
  broadcaster.setAttribute("id", "viewListitSidebar");
  broadcaster.setAttribute("label", "list.it");
  broadcaster.setAttribute("type", "checkbox");
  broadcaster.setAttribute("autoCheck", "false");
  broadcaster.setAttribute("group", "sidebar");
  broadcaster.setAttribute("sidebarurl", SIDEBAR_URL);
  broadcaster.setAttribute("sidebartitle", "list.it");
  broadcaster.setAttribute("oncommand", "toggleSidebar('viewListitSidebar')");
  broadcasters.appendChild(broadcaster);
};


var setupMenu = function(window) {
  var document = window.document;
  var menu = document.getElementById('viewSidebarMenu');
  var menuitem = document.createElement('menuitem');
  menuitem.setAttribute("command", "viewListitSidebar");
  menuitem.setAttribute("observes", "viewListitSidebar");
  menuitem.setAttribute("key", "key_viewListitSidebar");
  menuitem.classList.add("listit");
  menu.appendChild(menuitem);
};

var setupIcon = function(window) {
  var document = window.document;
  var button = document.createElement("toolbarbutton");
  button.setAttribute("id", "listitButton");
  button.setAttribute("command", "viewListitSidebar");
  button.setAttribute("observes", "viewListitSidebar");
  button.setAttribute("key", "key_viewListitSidebar");
  button.setAttribute("image", "chrome://listit/content/webapp/img/icon16.png");
  button.setAttribute("class", "listit toolbarbutton-1 chromeclass-toolbar-additional");
  restorePosition(document, button);
};

var restorePosition = function(document, button) {
  (document.getElementById("navigator-toolbox") || document.getElementById("mail-toolbox")).palette.appendChild(button); // what. what. i don't understand what those toolboxes are. Dunno if selecting one or the other is necessary... [maybe a thing for different ff versions?]

  //check which (if any) toolbar the button should be located in:
  var toolbars = document.querySelectorAll("toolbar");
  var toolbar, currentset, idx;
  for (var i = 0; i < toolbars.length; i++) {
    currentset = toolbars[i].getAttribute("currentset").split(",");
    idx = currentset.indexOf(button.id);
    if (idx !== -1) {
      toolbar = toolbars[i];
      break;
    }
  }

  //if the save position wasn't found, use the default one:
  //this why putting icon in palette doesn't work and why bmreplace guy did "if it exists" and set the default on enabling it.
  var defaultToolbar = "addon-bar";
  var defaultBefore;
  if (!toolbar) {
    toolbar = document.getElementById(defaultToolbar);
    currentset = toolbar.getAttribute("currentset").split(",");
    //idx = currentset.indexOf(defaultBefore) || -1;
    var whatwhat = currentset.indexOf(defaultBefore);
    if (whatwhat) {
      idx = whatwhat;
      currentset.splice(idx, 0, button.id);
    } else {
      idx = -1;
      currentset.push(button.id);
    }
    toolbar.setAttribute("currentset", currentset.join(","));
    //toolbar.currentSet = currentset.join(","); //this is ugly, fix if this solves the problem.
    //document.persist(toolbar.id, "currentset"); //welp this isn't helping.
  }

  //put the button into the toolbar it belongs in:
  // when the default happens this is a suuuuper stupid way of doing it but like... oh well.
  if (toolbar) {
    if (idx !== -1) { //this is necessary in his, I don't think it is necessary in ours yet... until we implement the default guy...
      for (var q = idx + 1; q <currentset.length; q++) {
        //oh dear lord why the shit is this a for loop oh my god wat wat wat
        // I still fundamentally don't understand what the shit is happening here.
        var before = document.getElementById(currentset[q]);
        if (before) {
          toolbar.insertItem(button.id, before);
          //toolbar.setAttribute("currentset", toolbar.currentSet);
          //toolbar.currentSet
          //document.persist(toolbar.id, "currentset");
          return; //why is it returning? should it be breaking? I. what. {returning ends the function. so it does make sense.}
        }
      }
    } else {
      toolbar.insertItem(button.id);
    }
  }

};

var bindKey = function(keyEl, hotkey) {
  var pieces = hotkey.split('+');
  var key = pieces.pop();
  var modifiers = pieces.map(function(p) {
    if (p === "ctrl") {
      return "accel";
    } else {
      return p;
    }
  }).join(' ');
  keyEl.setAttribute('key', key.toUpperCase());
  keyEl.setAttribute('modifiers', modifiers);
};

var setupBrowserHotkey = function(window, hotkey) {
  var document = window.document;
  if (!hotkey) { return; }
  try {

    var hotkeys = document.getElementById("ListItKeys");
    if (hotkeys) {
      document.documentElement.removeChild(hotkeys);
    }
    hotkeys = document.createElement('keyset');
    hotkeys.setAttribute("id", "ListItKeys");
    hotkeys.classList.add('listit');

    var openHotkey = document.createElement('key');
    openHotkey.classList.add('listit');

    // Not my fault! addEventListener('command',...) doesn't work and I don't
    // want to leak references.
    openHotkey.setAttribute(
      'oncommand', "(function toggleOrFocusListItSidebar() {" +
      "var broadcaster = document.getElementById('viewListitSidebar');" +
      "var sidebar = document.getElementById('sidebar');" +
      "if (broadcaster.getAttribute('checked') === 'true' && !sidebar.contentDocument.hasFocus())" +
      "{sidebar.focus();} else {window.toggleSidebar('viewListitSidebar');}"+
      "})()");
    openHotkey.setAttribute("id", "key_viewListitSidebar");
    bindKey(openHotkey, hotkey);

    hotkeys.appendChild(openHotkey);
    document.documentElement.appendChild(hotkeys);

  } catch (e) { Cu.reportError(e); }
};

var setupPreferenceListener = function() {
  ListIt.preferences.on('change:openHotkey', function(m, hotkey) {
    eachWindow(function(domWindow) {
      setupBrowserHotkey(domWindow, hotkey);
    });
  });
};

var windowListener = {
  onOpenWindow: function(xulWindow) {
    // A new window has opened
    var domWindow = xulWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                             .getInterface(Ci.nsIDOMWindow);

    // Wait for it to finish loading
    domWindow.addEventListener("load", function listener() {
      domWindow.removeEventListener("load", listener, false);
      if (domWindow.document.documentElement.getAttribute("windowtype") === "navigator:browser") {
        ListItWM.setupBrowser(domWindow);
      }
    }, false);
  },
  onCloseWindow: function(xulWindow) {},
  onWindowTitleChange: function(xulWindow) {}
};


ListItWM.setupBrowser = function(window) {
  setupBroadcaster(window);
  setupMenu(window);
  setupIcon(window);
  setupBrowserHotkey(window, ListIt.preferences.get('openHotkey'));
};

ListItWM.teardownBrowser = function(window) {
  Array.slice(window.document.getElementsByClassName("listit"), 0).forEach(function(el) {
    el.parentNode.removeChild(el);
  });
};

ListItWM.disable = function(window) {
  //need to remove the listitButton from the currentset of whichever toolbar it was in 
  var toolbars = window.document.querySelectorAll("toolbar");
  for (var i = 0; i < toolbars.length; i++) {
    var currentset = toolbars[i].getAttribute("currentset").split(",");
    var idx = currentset.indexOf("listitButton");
    if (idx !== -1) {
      currentset.splice(idx, 1);
      toolbars[i].setAttribute("currentset", currentset.join(","));
      //toolbars[i].currentSet = currentset.join(","); //necessary???
    }
    //window.persist(toolbars[i], "currentset");
  }
};

ListItWM.setup = function(realListIt) {
  ListIt = realListIt;
  eachWindow(function(domWindow) {
    ListItWM.setupBrowser(domWindow);
  });
  setupPreferenceListener();
  wm.addListener(windowListener);
};

ListItWM.teardown = function(reason) {
  wm.removeListener(windowListener);
  eachWindow(function(domWindow) {
    var sidebarBox = domWindow.document.getElementById("sidebar-box");
    if (sidebarBox.getAttribute("sidebarcommand") === "viewListitSidebar") {
      domWindow.toggleSidebar();
    }
    ListItWM.teardownBrowser(domWindow);
    if (reason === 4) {
      ListItWM.disable(domWindow);
    }
  });
};
