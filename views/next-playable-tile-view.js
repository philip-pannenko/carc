var app = app || {};
(function ($) {
  'use strict';
  app.NextPlayableTileView = Backbone.View.extend({
    el: '#nextPlayableTile',
    model: app.NextPlayableTile,
    initialize: function () {
      this.model = new app.NextPlayableTile();
      Backbone.on('assignCurrentTileToTile', this.assignCurrentTileToTile, this);
      Backbone.on('compareTileToCurrentTurnTile', this.compareTileToCurrentTurnTile, this);
      Backbone.on('nextTurn', this.nextTurn, this);
      Backbone.on('rotate', this.rotate, this);
      this.render();
    },
    render: function () {
      this.$el.removeClass();
      this.$el.addClass('tile ' + this.model.get('currentTurnTile').class + ' ' + this.model.get('currentTurnTile').rotation.class);
    },
    rotate: function (e) {
      var nextPlayableTile = this.model.get('currentTurnTile');
      var id = e.currentTarget.id;
      nextPlayableTile.rotation = nextPlayableTile.rotation[id];
      if (id === 'CW') {
        var temp = nextPlayableTile.faces['T'];
        nextPlayableTile.faces['T'] = nextPlayableTile.faces['L'];
        nextPlayableTile.faces['L'] = nextPlayableTile.faces['B'];
        nextPlayableTile.faces['B'] = nextPlayableTile.faces['R'];
        nextPlayableTile.faces['R'] = temp;
      } else if (id === 'CCW') {
        var temp = nextPlayableTile.faces['T'];
        nextPlayableTile.faces['T'] = nextPlayableTile.faces['R'];
        nextPlayableTile.faces['R'] = nextPlayableTile.faces['B'];
        nextPlayableTile.faces['B'] = nextPlayableTile.faces['L'];
        nextPlayableTile.faces['L'] = temp;
      }
      this.render();
    },
    assignCurrentTileToTile: function (tile) {
      tile.set('placedTile', this.model.get('currentTurnTile'));
      tile.set('name', this.model.get('currentTurnTile').class);
    },
    nextTurn: function () {
      debugger;
      this.model.set('currentTurnTile', this.model.get('playableTiles').pop());
      this.render();
    },
    compareTileToCurrentTurnTile: function (args) {
      var tile = args[0];
      var dir = args[1];
      var key = args[2];
      var isTilePlaced = args[3];
      var adjacentNeighbor = tile.get('adjacentNeighbors')[key];
      if (adjacentNeighbor && adjacentNeighbor.get('isPlaced')) {
        console.log('adjacentNeighbor.id ' + key + ' ' + adjacentNeighbor.id);
        var oppositeDir = dir.dir.opposite.name;
        var neighborFace = adjacentNeighbor.get('placedTile').faces[oppositeDir];
        var playableTileFace = this.model.get('currentTurnTile').faces[key]
        if (!(playableTileFace === neighborFace)) {
          isTilePlaced.isValid = false;
        }
      }
    }
  });
})(jQuery);