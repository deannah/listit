var Widget = require("widget").Widget;
var { Hotkey } = require("sdk/hotkeys");
var self = require('self');

exports.main = function() {

    var sidebarurl = self.data.url("test.html");
    var testicon = self.data.url("img/icon16.png");
    var sidebarid = "testSidebar";
    var testclass = "listitClass";

    var sidebar = require("dhsidebar").createSidebar();

    var broadcaster = require("dhbroadcaster").setupBroadcaster({
        id: sidebarid,
        label: "List.it",
        sbclass: testclass,
        sidebarurl: sidebarurl,
        sidebartitle: "List.it Sidebar"
    });

    var hotkey = Hotkey({
        combo: "control-shift-x",
        onPress: function() {
            console.log("hi hi I like hotkeys");
            sidebar.toggle(sidebarid);
        }
    });

    var menuitem = require("dhmenuitem").setupMenuitem({
        miclass: testclass,
        observes: broadcaster,
        key: hotkey
    });

    new Widget({
        id: "deannah-widget-1",
        label: "My Mozilla Widget",
        contentURL: testicon,
        onClick: function(event) {
            sidebar.show();
            sidebar.toggle(sidebarid);
        }
    });

};
