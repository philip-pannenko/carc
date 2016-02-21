var app = app || {};
(function () {
  'use strict';
  app.Grid = Backbone.Model.extend({
    defaults: function () {
      return {
        'tiles': new app.Tiles()
      }
    },

    updateNewTilesNeighbors: function (newTilesView, totalColumnCount, totalRowCount) {
      _.each(newTilesView, function (newTileView) {
        newTileView.updateNewTilesNeighbor(totalColumnCount, totalRowCount);
      }, this);
    },
    assignTileDOMToTileView: function(newTilesDOM) {
      var newTilesView = [];
      for (var i = 0; i < newTilesDOM.length; i++) {
        var tile = new app.Tile({id: newTilesDOM[i].id});
        var tileView = new app.TileView({el: newTilesDOM[i], model: tile});
        tileView.render();
        this.get('tiles').add(tile);
        newTilesView[i] = tileView;
      }
      return newTilesView;
    }

  });
})();