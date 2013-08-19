// created by Deanna Heer
// except like it basically just copies the code Steven did which is the standard, but oh well.

exports.create = function() {

  var sidebar = {};

  sidebar.toggle = function(id) {
    //var window = WindowMediator.getMostRecentWindow("navigator:browser");
    var window = require("Window").get();
    window.toggleSidebar(id);
  };
    
  sidebar.destroy = function() {};
    
  return sidebar;
};

