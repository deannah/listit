// created by Deanna Heer

exports.setup = function(options) {

  var document = require("Window").get().document;

  var miclass = options.miclass || "defaultClass";
  var observes = options.observes;

  var menuitem = document.createElement('menuitem');
  menuitem.setAttribute("class", miclass);
  menuitem.setAttribute("observes", observes);
  // TODO: find a way to make it list the keytext in the menu.

  var menu = document.getElementById('viewSidebarMenu');
  menu.appendChild(menuitem);
};