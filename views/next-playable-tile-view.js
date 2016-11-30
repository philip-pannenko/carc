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
      this.$el.addClass('tile ' + this.model.get('class') + ' ' + this.model.get('rotation'));
      this.$el.html(this.model.get('id'));
      return this;
    },
    compareTileToCurrentTurnTile: function (tile) {
      var isTileValidDrop = app.Tile.isNewTileValidDrop(tile, this.model);
      if (isTileValidDrop) {
        app.Tile.assignTileToOtherTile(tile, this.model);
      }
    },
    rotate: function (e) {
      if (app.game.isGameStateTile()) {
        app.Tile.rotate(this.model, e.currentTarget.id);
      }
    },

    destroy: function () {
      Backbone.off('compareTileToCurrentTurnTile');
      Backbone.off('rotate');
      this.remove();
      this.unbind();
    }
  });
})(jQuery);