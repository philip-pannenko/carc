var app = app || {};
(function ($) {
  'use strict';
  app.GridView = Backbone.View.extend({
    el: '#board',
    mode: app.GridView,
    initialize: function (options) {
      Backbone.on('tilePlaced', this.tilePlaced, this);
      this.model = new app.Grid();
      this.collection = new app.Tiles();
      for (var i = 0, row; row = this.$el[0].rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
          var tile = null;
          if ((i == 0 && j == 1) || (i == 1 && j == 0) || (i == 1 && j == 2) || (i == 2 && j == 1)) {
            tile = new app.Tile({id: col.id, state: app.TileState.unoccupied});
          } else if (i == 1 && j == 1) {
            var tile = options.tile;
            tile.set({
              id: col.id,
              state: app.TileState.occupied
            });
          } else {
            tile = new app.Tile({id: col.id});
          }
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
      // Connect segments
      //this.connectSegments(cell);
      // Update the selected tiles neighbors
      this.updatePlayableTiles(cell);
      Backbone.trigger('nextTurn', this.el);
    },
    expandSegments: function (cell) {
    },
    expandBoardIfNeeded: function (cell) {
      var cellIndex = cell.cellIndex;
      var rowIndex = cell.parentElement.rowIndex;
      var totalRowCount = cell.parentElement.parentElement.childElementCount;
      var totalColumnCount = cell.parentElement.childElementCount;
      var expandX = false;
      var expandY = false;
      var row = null;
      var col = null;
      if (cellIndex === 0) {
        // expand to left
        col = 0;
        expandX = true;
      } else if (totalColumnCount - 1 === cellIndex) {
        // expand to right
        col = -1;
        expandX = true;
      } else if (rowIndex === 0) {
        // expand up
        row = 0;
        expandY = true;
      } else if (totalRowCount - 1 === rowIndex) {
        // expand down
        row = -1;
        expandY = true;
      }
      if (expandX || expandY) {

        // create DOM Tiles
        if (expandY) {
          row = this.el.insertRow(row);
          for (var i = 0; i < totalColumnCount; i++) {
            cell = row.insertCell(0);
            cell.id = app.TILE_SEQ_NUM++;
            this.model.get('newTiles').push(cell);
          }
        } else if (expandX) {
          for (var i = 0; i < totalRowCount; i++) {
            cell = this.el.firstElementChild.children[i].insertCell(col);
            cell.id = app.TILE_SEQ_NUM++;
            this.model.get('newTiles').push(cell);
          }
        }
        // update counts after DOM modification
        totalColumnCount = cell.parentElement.childElementCount;
        totalRowCount = cell.parentElement.parentElement.childElementCount;
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
      _.each(app.NeighborDirection, function (dir, key) {
        var adjacentTile = tile.get('adjacentNeighbors')[key];
        if (adjacentTile.get('state') === null) {
          adjacentTile.set('state', app.TileState.unoccupied);
          // segment work todo
        } else if (adjacentTile.get('state') === app.TileState.occupied) {

          // Get the opposite tiles segment and merge it with this one.
          var oppositeDir = dir.dir.opposite.name;
          debugger;
          var neighborFace = adjacentTile.get('faces')[oppositeDir];
          var playableTileFace = tile.get('faces')[key];
          return playableTileFace.face !== neighborFace.face;
        }
      }, this);
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
        _.each(app.Direction, function (val, key) {
          var x = newTileView.el.cellIndex;
          var y = newTileView.el.parentNode.rowIndex;
          var neigh_x = x + val.x;
          var neigh_y = y + val.y;
          if (neigh_x < 0 || neigh_x === totalColumnCount ||
            neigh_y < 0 || neigh_y === totalRowCount ||
            (neigh_y === y && neigh_x === x )) {
            // skip direction
          } else {
            var newTile = newTileView.model;
            //var x = newTileView.el.cellIndex;
            var id = val.getElId(newTileView.el, x);
            var neighborTile = this.collection.get(id);
            //var neighborTile = this.getNeighboringTile(newTileView.el, dir);
            newTile.get('adjacentNeighbors')[key] = neighborTile;
            neighborTile.get('adjacentNeighbors')[val.opposite.name] = newTile;
          }
        }, this);
      }, this);
    }
  });
})(jQuery);