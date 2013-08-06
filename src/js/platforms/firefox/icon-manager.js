// Handles the toolbar button.

'use strict';

var EXPORTED_SYMBOLS = ["ListItIM"];

var ListItIM = {};

// creates the dom element for the toolbar button, and the basis for adding it to a toolbar.
var createIcon = function(window, reason) {
  var document = window.document;
  var button = document.createElement("toolbarbutton");
  button.setAttribute("id", "listitButton");
  button.setAttribute("command", "viewListitSidebar");
  button.setAttribute("observes", "viewListitSidebar");
  button.setAttribute("key", "key_viewListitSidebar");
  button.setAttribute("image", "chrome://listit/content/webapp/img/icon16.png");
  button.setAttribute("class", "listit toolbarbutton-1 chromeclass-toolbar-additional");
  document.getElementById("navigator-toolbox").palette.appendChild(button);
  if (reason === 3) { // Enabling extension, should use default position.
    useDefaultPosition(document, button);
  } else {
    addIcon(document, button);
  }
};

var addIcon = function(document, button) {
  //check which (if any) toolbar the button should be located in:
  // when restarting firefox, this will allow the position of the icon to persist:
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

  // // if no toolbar was found, just use the default:
  // // should actually be called if reason = enable, but like, you know, whatev.
  // if (!toolbar) {
    // useDefaultPosition(document, button);
    // return; //this will be unnecessary when we do this for the reason. we'll just use some if statements and shit and all will be well. 
  // }
  
  // put the button into the toolbar it belongs in. This is a derpy way of doing it if it just used the default, but oh well.
  if (toolbar) {
    insertButton(document, button, toolbar);
  }
};

// if extension is being first enabled, add the icon to the default position.
var useDefaultPosition = function(document, button) {
  var defaultToolbar = "addon-bar";
  var toolbar = document.getElementById(defaultToolbar);
  var currentset = toolbar.getAttribute("currentset").split(",");
  currentset.push(button.id);
  toolbar.setAttribute("currentset", currentset.join(","));
  toolbar.currentSet = currentset.join(",");
  toolbar.insertItem(button.id);
};

var insertButton = function(document, button, toolbar) { // I have no idea why this is using a different method from the use default guy.
  var itemAfter = document.getElementById(currentset[i+1]);
  toolbar.insertItem(button.id, before);
  toolbar.setAttribute("currentset", toolbar.currentSet);
};

var removeIcon = function(window) {
  //need to remove the listitButton from the currentset of whichever toolbar it was in 
  var toolbars = window.document.querySelectorAll("toolbar");
  for (var i = 0; i < toolbars.length; i++) {
    var currentset = toolbars[i].getAttribute("currentset").split(",");
    var idx = currentset.indexOf("listitButton");
    if (idx !== -1) {
      currentset.splice(idx, 1);
      toolbars[i].setAttribute("currentset", currentset.join(","));
      toolbars[i].currentSet = currentset.join(","); //necessary???
      // in bug free code we could break/return/whatever here. but for now I want it to remove the icon from every toolbar just in case.
    }
  }
};

ListItIM.createButton = function(window, reason) { // I don't know if this level of functionwhatnotexportationshit is actually necessary. Womp womp womp.
  createIcon(window, reason);
};

ListItIM.destroyButton = function(window) {
  removeIcon(window);
};
