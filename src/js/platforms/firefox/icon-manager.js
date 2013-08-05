// Handles the toolbar button.

'use strict';

var EXPORTED_SYMBOLS = ["ListItIM"];

var ListItIM = {};

// creates the dom element for the toolbar button, and the basis for adding it to a toolbar.
var createIcon = function(window) {
  var document = window.document;
  var button = document.createElement("toolbarbutton");
  button.setAttribute("id", "listitButton");
  button.setAttribute("command", "viewListitSidebar");
  button.setAttribute("observes", "viewListitSidebar");
  button.setAttribute("key", "key_viewListitSidebar");
  button.setAttribute("image", "chrome://listit/content/webapp/img/icon16.png");
  button.setAttribute("class", "listit toolbarbutton-1 chromeclass-toolbar-additional");
  (document.getElementById("navigator-toolbox") || document.getElementById("mail-toolbox")).palette.appendChild(button);
  restorePosition(document, button);
};

//should probably be called "add icon" because this is the function that adds the icon to one of the toolbars.
var restorePosition = function(document, button) {
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
          toolbar.setAttribute("currentset", toolbar.currentSet);
          document.persist(toolbar.id, "currentset");
          return; //why is it returning? should it be breaking? I. what. {returning ends the function. so it does make sense.}
        }
      }
    } else {
      toolbar.insertItem(button.id);
    }
  }

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

ListItIM.createButton = function(window) { // I don't know if this level of functionwhatnotexportationshit is actually necessary. Womp womp womp.
  createIcon(window);
};

ListItIM.destroyButton = function(window) {
  removeIcon(window);
};
