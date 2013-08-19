//sets up a broadcaster which is how the sidebar is managed.

exports.setupBroadcaster = function(options) {

  var document = require("Window").get().document;

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
