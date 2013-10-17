(function(L) {
  ListIt.lvent.once('setup:models:after', function(L) {
    L.omnibox.on( "note-created", function() {
      console.log("wompity woo");
      L.server.syncNotes();
    })
  });
  
})(ListIt);
