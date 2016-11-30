var app = app || {};
(function ($) {
  'use strict';
  app.GridView = Backbone.View.extend({
    el: '#board',
    mode: app.GridView,
    initialize: function (options) {

      Backbone.on('placeTile', this.placeTile, this);
      this.model = new app.Grid();

      var newTileViews = [];
      // TODO Add method to extract all EL ids, in a data structure that is X,Y,ID
      // TODO Pass that into model to do this whole for-loop
      // TODO Loop one last time to do a render on all tiles...
      for (var i = 0, row; row = this.$el[0].rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
          var tile = this.model.initializeTile(col, i, j);
          newTileViews.push(new app.TileView({el: col, id: col.id, model: tile}));
        }
      }

      _.each(newTileViews, function (newTileView) {
        this.model.linkSurroundingTiles(newTileView, 3, 3);
        newTileView.render();
      }, this);

    },

    placeTile: function (cell) {
      // Determine if board needs expanding
      this.expandBoardIfNeeded(cell);
      // Connect segments
      //this.connectSegments(cell);

      // Update the selected tiles neighbors
      var tile = app.game.getTile(cell.id);
      tile.updateAdjacentTiles();
      Backbone.trigger('tilePlacedOnGrid', tile);
    },

    // TODO see how much of this can be moved into the model although needs to be in view because we're handling creating additional rows/cols
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
            var yCell = row.insertCell(i); // VIEW related
            yCell.id = app.TILE_SEQ_NUM++;
            newTilesDOM.push(yCell);
          }
        } else if (expandX) {
          for (var i = 0; i < totalRowCount; i++) {
            var xCell = this.el.firstElementChild.children[i].insertCell(col); // VIEW related
            xCell.id = app.TILE_SEQ_NUM++;
            newTilesDOM.push(xCell);
          }
        }
        // update counts after DOM modification
        totalColumnCount = cell.parentElement.childElementCount;
        totalRowCount = cell.parentElement.parentElement.childElementCount;

        // assign DOM Tiles to Models
        var newTileViews = this.model.assignTileDOMToTileView(newTilesDOM);

        _.each(newTileViews, function (newTileView) {
          this.model.linkSurroundingTiles(newTileView, totalColumnCount, totalRowCount);
          newTileView.render();
        }, this);

      }
    }


  });
})(jQuery);