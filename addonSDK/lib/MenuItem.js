// created by Deanna Heer

exports.setupMenuitem = function(options) {

  var { Cc, Cu, Ci } = require('chrome');
  var WindowMediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

  var window = WindowMediator.getMostRecentWindow("navigator:browser");
  var document = window.document;

  var miclass = options.miclass || "defaultClass";
  var observes = options.observes;
  var key = document.createElement('key');
  key.setAttribute("keytext", "Control+Shift+X");

  var menuitem = document.createElement('menuitem');
  menuitem.setAttribute("class", miclass);
  menuitem.setAttribute("observes", observes);
  menuitem.setAttribute("key", key);

  var menu = document.getElementById('viewSidebarMenu');
  menu.appendChild(menuitem);
};