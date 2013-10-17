(function(L) {
  // L.views.OmniboxView = L.views.OmniboxView.extend({
//     
    // L.views.OmniboxView.prototype.save();
  // });
  // L.models.Server.initialized = function() {
    // L.models.Server.prototype.initialized();
  // };
  L.models.Omnibox.initialized = function() {
    L.models.Omnibox.prototype.initialized();
    this.listenTo(this, "note-created", function() {
      L.Server.syncNotes();
    });
  };
  
})(ListIt);
