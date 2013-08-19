// created by Deanna Heer
// except like it basically just copies the code Steven did which is the standard, but oh well.

exports.createSidebar = function() {

  var { Cc, Cu, Ci } = require('chrome');
  var WindowUtils = require('window-utils');
  var WindowMediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
  
  var sidebar = {};

  sidebar.toggle = function(id) {
    var window = WindowMediator.getMostRecentWindow("navigator:browser");
    window.toggleSidebar(id);
  };
    
  sidebar.destroy = function() {};
    
  return sidebar;
};

