var app = app || {};
(function ($) {
  'use strict';
  app.GridView = Backbone.View.extend({
    el: '#board',
    mode: app.GridView,
    initialize: function (options) {
      Backbone.on('tilePlaced', this.tilePlaced, this);
      this.model = new app.Grid();
      var newTilesView = [];

      for (var i = 0, row; row = this.$el[0].rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
          var tile = null;
          if ((i == 0 && j == 1) || (i == 1 && j == 0) || (i == 1 && j == 2) || (i == 2 && j == 1)) {
            tile = new app.Tile({id: col.id, state: app.TileState.unoccupied});
          } else if (i == 1 && j == 1) {
            tile = options.tile;
            tile.set({
              id: col.id,
              state: app.TileState.occupied
            });
          } else {
            tile = new app.Tile({id: col.id});
          }
          var tileView = new app.TileView({el: col, id: col.id, model: tile});
          this.model.get('tiles').add(tile);
          newTilesView.push(tileView);
        }
      }
      this.model.updateNewTilesNeighbors(newTilesView, 3, 3);
    },

    tilePlaced: function (cell) {
      // Determine if board needs expanding
      this.expandBoardIfNeeded(cell);
      // Connect segments
      //this.connectSegments(cell);
      // Update the selected tiles neighbors
      var tile = this.model.get('tiles').get(cell.id);
      tile.updateAdjacentTiles();

      Backbone.trigger('nextTurn', this.el);
    },

    // needs to be in view because we're handling creating additional rows/cols
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
        var newTilesDOM = [];

        // create DOM Tiles
        if (expandY) {
          row = this.el.insertRow(row);
          for (var i = 0; i < totalColumnCount; i++) {
            var yCell = row.insertCell(i);
            yCell.id = app.TILE_SEQ_NUM++;
            newTilesDOM.push(yCell);
          }
        } else if (expandX) {
          for (var i = 0; i < totalRowCount; i++) {
            var xCell = this.el.firstElementChild.children[i].insertCell(col);
            xCell.id = app.TILE_SEQ_NUM++;
            newTilesDOM.push(xCell);
          }
        }
        // update counts after DOM modification
        totalColumnCount = cell.parentElement.childElementCount;
        totalRowCount = cell.parentElement.parentElement.childElementCount;

        // assign DOM Tiles to Models
        var newTilesView = this.model.assignTileDOMToTileView(newTilesDOM);
        this.model.updateNewTilesNeighbors(newTilesView, totalColumnCount, totalRowCount);
      }
    }


  });
})(jQuery);