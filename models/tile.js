var app = app || {};
(function () {
  'use strict';
  app.Tile = Backbone.Model.extend({
    defaults: function () {
      return {
        id: -1,
        adjacentNeighbors: {},
        class: "",
        faces: {},
        segments: [],
        state: app.TileState.undefined,
        rotation: app.Rotation._0
      }
    },
    // rotationDirecion is either CW or CCW
    rotate: function (rotationDirecion) {
      this.set('rotation', app.Rotation[this.get('rotation')[rotationDirecion]]);
      var faces = this.get('faces');
      var temp = faces['T'];
      if (rotationDirecion === 'CW') {
        faces['T'] = faces['L'];
        faces['L'] = faces['B'];
        faces['B'] = faces['R'];
        faces['R'] = temp;
      } else if (rotationDirecion === 'CCW') {
        faces['T'] = faces['R'];
        faces['R'] = faces['B'];
        faces['B'] = faces['L'];
        faces['L'] = temp;
      }
    },

    updateAdjacentTiles: function() {
      _.each(app.NeighborDirection, function (dir, key) {
        var adjacentTile = this.get('adjacentNeighbors')[key];
        if (adjacentTile.get('state') === null) {
          adjacentTile.set('state', app.TileState.unoccupied);
          // segment work todo
        //} else if (adjacentTile.get('state') === app.TileState.occupied) {

          // Get the opposite tiles segment and merge it with this one.
          //var oppositeDir = dir.dir.opposite.name;
          //var neighborFace = adjacentTile.get('faces')[oppositeDir];
          //var playableTileFace = tile.get('faces')[key];
          //return playableTileFace.face !== neighborFace.face;
        }
      }, this);
    },

    compareTileToCurrentTurnTile: function(tile) {
      var foundConflictingNeighborFace = _.find(app.NeighborDirection, function (dir, key) {
        var adjacentNeighbor = tile.get('adjacentNeighbors')[key];
        if (adjacentNeighbor && adjacentNeighbor.get('state') === app.TileState.occupied) {
          var neighborFace = adjacentNeighbor.get('faces')[dir.oppositeDirName];
          var playableTileFace = this.get('faces')[key];
          return playableTileFace.face !== neighborFace.face;
        } else {
          return false;
        }
      }, this);
      if (!foundConflictingNeighborFace) {
        // assign this models tile info with the tile that was passed into this method
        tile.set({
          class: this.get('class'),
          faces: this.get('faces'),
          segments: this.get('segments'),
          rotation: this.get('rotation'),
          state: app.TileState.occupied
        });
      }
    },

    assignNeighboringTilesWithOneAnother: function(options) {
      options.tile.get('adjacentNeighbors')[options.dir.name] = this;
      this.get('adjacentNeighbors')[options.dir.oppositeDirName] = options.tile;
    }
  });
})();