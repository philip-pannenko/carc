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

    rotate: function (rotation) {
      this.set('rotation', this.get('rotation')[rotation]);
      var faces = this.get('faces');
      var temp = faces['T'];
      if (rotation === 'CW') {
        faces['T'] = faces['L'];
        faces['L'] = faces['B'];
        faces['B'] = faces['R'];
        faces['R'] = temp;
      } else if (rotation === 'CCW') {
        faces['T'] = faces['R'];
        faces['R'] = faces['B'];
        faces['B'] = faces['L'];
        faces['L'] = temp;
      }
    },

    updatePlayableTiles: function() {
      _.each(app.NeighborDirection, function (dir, key) {
        var adjacentTile = this.get('adjacentNeighbors')[key];
        if (adjacentTile.get('state') === null) {
          adjacentTile.set('state', app.TileState.unoccupied);
          // segment work todo
        //} else if (adjacentTile.get('state') === app.TileState.occupied) {

          // Get the opposite tiles segment and merge it with this one.
          //var oppositeDir = dir.dir.opposite.name;
          //debugger;
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
          var oppositeDir = dir.dir.opposite.name;
          var neighborFace = adjacentNeighbor.get('faces')[oppositeDir];
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

    }
  });
})();