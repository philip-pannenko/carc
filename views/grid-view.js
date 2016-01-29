var app = app || {};
(function ($) {
  'use strict';
  app.GridView = Backbone.View.extend({
    el: '#board',
    mode: app.GridView,
    initialize: function () {
      Backbone.on('tilePlaced', this.tilePlaced, this);
      this.model = new app.Grid();
      this.collection = new app.Tiles();
      for (var i = 0, row; row = this.$el[0].rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
          var state = undefined;
          var placedTile = undefined;
          if ((i == 0 && j == 1) || (i == 1 && j == 0) || (i == 1 && j == 2) || (i == 2 && j == 1)) {
            state = app.TileState.unoccupied;
          } else if (i == 1 && j == 1) {
            placedTile = app.PlayableTiles.one_face_castle_with_straight_road;
            state = app.TileState.occupied;
          }
          var tile = new app.Tile({id: col.id, placedTile: placedTile, state: state});
          var tileView = new app.TileView({el: col, id: col.id, model: tile});
          this.collection.add(tile);
          this.model.get('newTiles').push(tileView);
        }
      }
      this.updateNewTilesNeighbors(3, 3);
      //this.model.set('row', undefined);
      //this.model.set('col', undefined);
      this.model.get('newTiles').clear();
    },
    tilePlaced: function (cell) {
      // Determine if board needs expanding
      this.expandBoardIfNeeded(cell);
      // Update the selected tiles neighbors
      this.updatePlayableTiles(cell);
      Backbone.trigger('nextTurn', this.el);
    },
    expandBoardIfNeeded: function (cell) {
      var cellIndex = cell.cellIndex;
      var rowIndex = cell.parentElement.rowIndex;
      var totalRowCount = cell.parentElement.parentElement.childElementCount;
      var totalColumnCount = cell.parentElement.childElementCount;
      var row = undefined;
      var col = undefined;
      if (cellIndex === 0) {
        // expand to left
        col = 0;
      } else if (totalColumnCount - 1 === cellIndex) {
        // expand to right
        col = -1;
      } else if (rowIndex === 0) {
        // expand up
        row = 0;
      } else if (totalRowCount - 1 === rowIndex) {
        // expand down
        row = -1;
      }
      if (row != undefined || col != undefined) {

        // create DOM Tiles
        if (row != undefined) {
          var row = this.el.insertRow(row);
          for (var i = 0; i < totalColumnCount; i++) {
            var cell = row.insertCell(0);
            cell.id = app.TILE_SEQ_NUM++;
            this.model.get('newTiles').push(cell);
          }
        } else if (col != undefined) {
          for (var i = 0; i < totalRowCount; i++) {
            var cell = this.el.firstElementChild.children[i].insertCell(col);
            cell.id = app.TILE_SEQ_NUM++;
            this.model.get('newTiles').push(cell);
          }
        }
        // update counts after DOM modification
        var totalColumnCount = cell.parentElement.childElementCount;
        var totalRowCount = cell.parentElement.parentElement.childElementCount;
        // assign DOM Tiles to Models
        this.assignTileDOMToModel();
        this.updateNewTilesNeighbors(totalColumnCount, totalRowCount);
      }
      // clear out temp data
      //this.model.set('row', undefined);
      //this.model.set('col', undefined);
      this.model.get('newTiles').clear();
    },
    updatePlayableTiles: function (cell) {
      var tile = this.collection.get(cell.id);
      _.map(app.NeighborDirection, function (dir, key) {
        var adjacentTile = tile.get('adjacentNeighbors')[key];
        if (adjacentTile.get('state') === undefined) {
          //adjacentTile.set('isPlayable', true);
          adjacentTile.set('state', app.TileState.unoccupied);
        }
      });
      //tile.set('isPlaced', true);
      //tile.set('isPlayable', false);
    },
    assignTileDOMToModel: function () {
      for (var i = 0; i < this.model.get('newTiles').length; i++) {
        var tile = new app.Tile({id: this.model.get('newTiles')[i].id});
        var tileView = new app.TileView({el: this.model.get('newTiles')[i], model: tile});
        tileView.render();
        this.collection.add(tile);
        this.model.get('newTiles')[i] = tileView;
      }
    },
    updateNewTilesNeighbors: function (totalColumnCount, totalRowCount) {
      _.each(this.model.get('newTiles'), function (newTileView) {
        _.map(app.Direction, function (dir, key) {
          var x = newTileView.el.cellIndex;
          var y = newTileView.el.parentNode.rowIndex;
          var neigh_x = x + dir.x;
          var neigh_y = y + dir.y;
          if (neigh_x < 0 || neigh_x === totalColumnCount ||
            neigh_y < 0 || neigh_y === totalRowCount ||
            (neigh_y === y && neigh_x === x )) {
            // skip direction
          } else {
            var newTile = newTileView.model;
            var x = newTileView.el.cellIndex;
            var id = dir.getElId(newTileView.el, x);
            var neighborTile = this.collection.get(id);
            //var neighborTile = this.getNeighboringTile(newTileView.el, dir);
            newTile.get('adjacentNeighbors')[key] = neighborTile;
            neighborTile.get('adjacentNeighbors')[dir.opposite.name] = newTile;
          }
        }, this);
      }, this);
    }
  });
})(jQuery);