var app = app || {};
(function ($) {
  'use strict';
  app.GridView = Backbone.View.extend({
    el: '#board',
    mode: app.GridView,
    initialize: function () {
      Backbone.on('tilePlaced', this.updateBoard, this);
      this.model = new app.Grid();
      this.collection = new app.Tiles();
      this.listenTo(this.collection, 'add', this.debug);
      for (var i = 0, row; row = this.$el[0].rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
          var isPlayable = false;
          if ((i == 0 && j == 1) || (i == 1 && j == 0) || (i == 1 && j == 2) || (i == 2 && j == 1)) {
            isPlayable = true;
          }
          var isPlaced = false;
          var placedTile = undefined;
          if (i == 1 && j == 1) {
            isPlaced = true;
            placedTile = app.PlayableTiles.one_face_castle_with_straight_road;
          }
          var tile = new app.Tile({id: col.id, isPlayable: isPlayable, isPlaced: isPlaced, placedTile: placedTile});
          var tileView = new app.TileView({el: col, id: col.id, model: tile});
          this.collection.add(tile);
          this.model.get('newTiles').push(tileView);
        }
      }
      this.model.set('totalColumnCount', 3);
      this.model.set('totalRowCount', 3);
      this.updateNewTilesNeighbors();
      this.model.set('row', undefined);
      this.model.set('col', undefined);
      this.model.get('totalRowCount', undefined);
      this.model.get('totalColumnCount', undefined);
      this.model.get('newTiles').clear();
    },
    updateBoard: function (cell) {
      // Determine if board needs expanding
      this.expandBoard(cell);
      // Update the selected tiles neighbors
      this.updatePlayableTiles(cell);

      Backbone.trigger('nextTurn', this.el);
    },

    expandBoard: function(cell) {
      var cellIndex = cell.cellIndex;
      var rowIndex = cell.parentElement.rowIndex;
      this.model.set('totalRowCount', cell.parentElement.parentElement.childElementCount);
      this.model.set('totalColumnCount', cell.parentElement.childElementCount);
      if (cellIndex === 0) {
        // expand to left
        this.model.set('col', 0);
      } else if (this.model.get('totalColumnCount') - 1 === cellIndex) {
        // expand to right
        this.model.set('col', -1);
      } else if (rowIndex === 0) {
        // expand up
        this.model.set('row', 0);
      } else if (this.model.get('totalRowCount') - 1 === rowIndex) {
        // expand down
        this.model.set('row', -1);
      }
      if (this.model.get('row') != undefined || this.model.get('col') != undefined) {

        // create DOM Tiles
        this.render();
        // update counts after DOM modification
        this.model.set('totalRowCount', cell.parentElement.parentElement.childElementCount);
        this.model.set('totalColumnCount', cell.parentElement.childElementCount);
        // assign DOM Tiles to Models
        this.assignTileDOMToModel();
        this.updateNewTilesNeighbors();
      }
      // clear out temp data
      this.model.set('row', undefined);
      this.model.set('col', undefined);
      this.model.get('totalRowCount', undefined);
      this.model.get('totalColumnCount', undefined);
      this.model.get('newTiles').clear();
    },

    updatePlayableTiles: function (cell) {
      var tile = this.collection.get(cell.id);
      _.map(app.NeighborDirection, function (dir, key) {
        var adjacentTile = tile.get('adjacentNeighbors')[key];
        if (!adjacentTile.get('isPlayable') && !adjacentTile.get('isPlaced')) {
          adjacentTile.set('isPlayable', true);
        }
      });
      tile.set('isPlaced', true);
      tile.set('isPlayable', false);
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
    updateNewTilesNeighbors: function () {
      _.each(this.model.get('newTiles'), function (newTileView) {
        var x = newTileView.el.cellIndex;
        var y = newTileView.el.parentNode.rowIndex;
        _.map(app.Direction, function (dir, key) {
          var neigh_x = x + dir.x;
          var neigh_y = y + dir.y;
          if (neigh_x < 0 || neigh_x === this.model.get('totalColumnCount') ||
            neigh_y < 0 || neigh_y === this.model.get('totalRowCount') ||
            (neigh_y === y && neigh_x === x )) {
            // skip direction
          } else {
            var newTile = newTileView.model;
            var x = el.cellIndex;
            var id = dir.getElId(el, x);
            var neighborTile = this.collection.get(id);

            //var neighborTile = this.getNeighboringTile(newTileView.el, dir);
            newTile.get('adjacentNeighbors')[key] = neighborTile;
            neighborTile.get('adjacentNeighbors')[dir.opposite.name] = newTile;
          }
        }, this);
      }, this);
    },
    render: function () {
      if (this.model.get('row') != undefined) {
        var row = this.el.insertRow(this.model.get('row'));
        for (var i = 0; i < this.model.get('totalColumnCount'); i++) {
          var cell = row.insertCell(0);
          cell.id = app.TILE_SEQ_NUM++;
          this.model.get('newTiles').push(cell);
        }
      } else if (this.model.get('col') != undefined) {
        for (var i = 0; i < this.model.get('totalRowCount'); i++) {
          var cell = this.el.firstElementChild.children[i].insertCell(this.model.get('col'));
          cell.id = app.TILE_SEQ_NUM++;
          this.model.get('newTiles').push(cell);
        }
      }
      return this;
    },
    debug: function (item) {
      //console.log('Adding id ' + item.id + ' to board');
    }
  });
})(jQuery);