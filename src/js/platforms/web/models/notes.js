(function(L) {
  ListIt.lvent.once('setup:models:after', function(L) {
    L.notebook.get("notes").on("add", function() {
      console.log("Syncing on note add.");
      L.server.pushNotes({
        error: L.server.syncNotes()
      });
    })
  });
})(ListIt);