var app = app || {};
(function ($) {
  'use strict';
  app.NextPlayableTileView = Backbone.View.extend({
    tagName: 'td',
    model: app.Tile,
    initialize: function () {
      this.model.on('change:currentTurnTile', this.render, this);
      this.model.on('change:rotation', this.render, this);
      Backbone.on('compareTileToCurrentTurnTile', this.compareTileToCurrentTurnTile, this);
      Backbone.on('rotate', this.rotate, this);
      this.render();
    },
    render: function () {
      this.$el.removeClass();
      this.$el.addClass('tile ' + this.model.get('class') + ' _' + this.model.get('rotation').id);
      this.$el.html(this.model.get('id'));
      return this;
    },
    compareTileToCurrentTurnTile: function(tile) {
      this.model.compareTileToCurrentTurnTile(tile);
    },
    rotate: function(e) {
      this.model.rotate(e.currentTarget.id);
    },

    destroy: function(){
      Backbone.off('compareTileToCurrentTurnTile');
      Backbone.off('rotate');
      this.remove();
      this.unbind();
    }
    //remove: function() {
    //  this.undelegateEvents();
    //  this.$el.empty();
    //  this.stopListening();
    //  return this;
    //}
  });
})(jQuery);