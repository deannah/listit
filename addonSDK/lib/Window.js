exports.get = function() {

  var { Cc, Cu, Ci } = require('chrome');
  var WindowMediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
  var window = WindowMediator.getMostRecentWindow("navigator:browser");
  
  return window;
};
