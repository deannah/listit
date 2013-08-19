// created by Deanna Heer
// This is going to mimic our old window manager
// it will create broadcaster, sidebar, menuitem, and hotkey.

exports.setupUI = function() { //I assume it will need options... maybe not.

  var ui = {};
  var self = require('self');
  var sidebarurl = self.data.url("test.html");
  var testicon = self.data.url("img/icon16.png");
  var sidebarid = "testSidebar";
  var testclass = "listitClass";

  ui.sidebar = require("Sidebar").create();

  ui.broadcasterid = require("Broadcaster").setup({
    id: sidebarid,
    label: "List.it",
    sbclass: testclass,
    sidebarurl: sidebarurl,
    sidebartitle: "List.it Sidebar"
    });
    
  ui.menuitem = require("MenuItem").setup({
    miclass: testclass,
    observes: ui.broadcasterid
  });
  
  var Widget = require("widget").Widget;
  var { Hotkey } = require("sdk/hotkeys");
  
  new Widget({
    id: "listitWidget",
    label: "Toggle List.it Sidebar",
    contentURL: testicon,
    onClick: function(event) {
      ui.sidebar.toggle(sidebarid);
    }
  });
    
  new Hotkey({
    combo: "control-shift-l",
    onPress: function() {
      ui.sidebar.toggle(sidebarid);
    }
  });

  return ui; //does this need to return them? does it need to return anything?
};

