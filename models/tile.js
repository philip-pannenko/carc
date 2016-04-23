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
        } else if (adjacentTile.get('state') === app.TileState.occupied) {

          console.log('This Tile Id: ' + this.id);
          // get the segment associated with the oppo
          var segmentIndices = adjacentTile.get('faces')[dir.oppositeDirName].segments;
          for(var i =0; i < segmentIndices.length; i++) {

            // get the opposite segment
            var adjacentFaceSegment = adjacentTile.get('segments')[segmentIndices[i]];

            // get the current segment
            var faceSegment = this.get('segments')[this.get('faces')[dir.name].segments[i]];
            console.log(' This Tile Id: ' + this.id + ', Segment[' + i +'].id: ' + faceSegment.id);
            console.log(' Adjacent Tile Id: ' + adjacentTile.id + ', Segment[' + i +'].id: ' + adjacentFaceSegment.id);

            // if the segments are not already connected, connect them
            if (adjacentFaceSegment.get('id') !== faceSegment.get('id')) {
              var connectedSegmentTiles = faceSegment.get('connectedTiles');

              // find all of the connected tiles on the current segment
              for(var j=0; j< connectedSegmentTiles.length; j++) {
                var connectedSegmentTile = connectedSegmentTiles[j];

                // search for a specific segment on the tile and swap it out with the new segment
                for(var y=0; y<connectedSegmentTile.get('segments').length; y++) {
                  var connectedTileSegment = connectedSegmentTile.get('segments')[y];

                  console.log('  Connected Tile Id: ' + connectedSegmentTile.id + ', Segment.id: ' + connectedTileSegment.id);

                  // when it's found, swap the segment with the new segment
                  if (connectedTileSegment === faceSegment) {
                    console.log('  Connected Tile Segment: ' + connectedTileSegment.id + ', Face Segment: ' + faceSegment.id);
                    connectedSegmentTile.get('segments')[y] = adjacentFaceSegment;
                    adjacentFaceSegment.get('connectedTiles').push(connectedSegmentTile);
                    break;
                  }
                }
              }
              adjacentFaceSegment.set('owned', faceSegment.get('owned')); // this needs to be changed to an array. for now, just true
            }
          }
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