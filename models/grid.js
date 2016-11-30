var app = app || {};
(function () {
  'use strict';
  app.Grid = Backbone.Model.extend({

    initializeTile: function (col, i, j) {
      var tile = null;
      var domId = Number(col.id);

      if ((i == 0 && j == 1) || (i == 1 && j == 0) || (i == 1 && j == 2) || (i == 2 && j == 1)) {
        tile = new app.Tile({id: domId, state: app.TileState.unoccupied});
      } else if (i == 1 && j == 1) {
        // TODO get rid of static app reference
        tile = app.game.get('nextPlayableTiles').pop();


        _.each(tile.get('segments'), function (segmentId, dir) {
          var segment = app.game.getSegment(segmentId);
          segment.get('connectedTiles')[0] = domId;
        }, this);

        tile.set({
          id: domId,
          state: app.TileState.occupied
        });

        // TODO get rid of static app reference
        app.game.recentlyPlacedTile = tile; // initialize the first tile playable by a pawn
      } else {
        tile = new app.Tile({id: domId});
      }

      app.game.get('tiles').add(tile);

      return tile;

    },

    assignTileDOMToTileView: function (newTilesDOM) {
      var newTileViews = [];
      for (var i = 0; i < newTilesDOM.length; i++) {
        var tile = new app.Tile({id: newTilesDOM[i].id});
        // TODO remove VIEW from model
        var tileView = new app.TileView({el: newTilesDOM[i], model: tile});
        tileView.render();
        app.game.get('tiles').add(tile);
        newTileViews[i] = tileView;
      }
      return newTileViews;
    },

    linkSurroundingTiles: function (newTileView, totalColumnCount, totalRowCount) {
      _.each(app.Direction, function (dir) {

        var coordinates = newTileView.getTileXYCoordinates();
        var tile = newTileView.model;
        var x = coordinates.x;
        var y = coordinates.y;
        var neigh_x = x + dir.relativeX;
        var neigh_y = y + dir.relativeY;
        if (!(neigh_x < 0 || neigh_x === totalColumnCount || neigh_y < 0 || neigh_y === totalRowCount || (neigh_y === y && neigh_x === x ))) {
          var neighborTileId = dir.getElId(newTileView.el, x);
          var neighborTile = app.game.getTile(neighborTileId);
          neighborTile.assignNeighboringTilesWithOneAnother(tile, dir);
        }
      }, this);

    }

  });
})();