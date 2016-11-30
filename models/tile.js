var app = app || {};
(function () {
  'use strict';
  app.Tile = Backbone.Model.extend({
    defaults: function () {
      return {
        id: -1,
        adjacentNeighbors: {}, // app.Direction.name : tile.id
        class: "",
        segments: {}, // app.Direction.name : segment.id
        state: app.TileState.undefined,
        rotation: app.Rotation._0.name,
        isPawnTarget: false,
        pawnCoordinates: undefined // app.Direction
      }
    },

    getSegmentByTileCoordinate: function (dir) {
      return this.get('segments')[dir.name];
    },

    updateAdjacentTiles: function () {
      _.each(app.DirectionFaces, function (directionFace, directionName) {
        var adjacentTile = this.getAdjacentNeighbor(directionName);
        if (app.Tile.isTileStateUndefined(adjacentTile)) {
          adjacentTile.set('state', app.TileState.unoccupied);
        } else if (app.Tile.isTileStateOccupied(adjacentTile)) {

          console.log('Tile ' + this.id + ' will merge segments with Adjacent Tile ' + adjacentTile.id);
          var adjacentTilesSegments = app.Tile.getDirectionFaceSegmentsForTile(adjacentTile, app.DirectionFaces[directionFace.opposite]);
          var thisTilesSegments = app.Tile.getDirectionFaceSegmentsForTile(this, directionFace);

          if (thisTilesSegments[1].get('type') === 'C' || thisTilesSegments[1].get('type') === 'F') {
            thisTilesSegments[1].mergeWithSegment(adjacentTilesSegments[1]);
          } else {
            thisTilesSegments[0].mergeWithSegment(adjacentTilesSegments[0]);
            thisTilesSegments[1].mergeWithSegment(adjacentTilesSegments[1]);
            thisTilesSegments[2].mergeWithSegment(adjacentTilesSegments[2]);
          }
        }
      }, this);
    },

    assignNeighboringTilesWithOneAnother: function (tile, dir) {
      tile.putAdjacentNeighbors(dir.name, this.id);
      this.putAdjacentNeighbors(dir.oppositeDirName, tile.id);
    },

    getAdjacentNeighbor: function (direction) {
      return app.game.getTile(this.get('adjacentNeighbors')[direction]);
    },

    putAdjacentNeighbors: function (direction, tileId) {
      this.get('adjacentNeighbors')[direction] = tileId;
    }

  }, {

    //* Static Methods *//

    // rotationDirecion is either CW or CCW
    rotate: function (tile, rotateDir) {

      tile.set('rotation', app.Rotation[tile.get('rotation')][rotateDir]);
      var faces = tile.get('faces');

      var clonedSegmentIndexByCoordinate = _.clone(tile.get('segments'));
      _.each(app.Direction, function (dir, dirName) {
        var nextSegmentIndex = tile.get('segments')[dirName];
        //var currentSegmentIndex = tile.get('segmentIndexByCoordinate')[dir[rotateDir]];
        //console.log(dir[rotateDir] + ':' + tile.get('segmentIndexByCoordinate')[dir[rotateDir]] + ', will be replaced by ' + dirName + ':' + nextSegmentIndex);
        clonedSegmentIndexByCoordinate[dir[rotateDir]] = nextSegmentIndex;
      }, this);
      tile.set('segments', clonedSegmentIndexByCoordinate, {silent: true});
    },

    getDirectionFaceSegmentsForTile: function (tile, directionFace) {
      var result = [];
      var index = -1;
      index = tile.get('segments')[directionFace.faces[0].name];
      result.push(app.game.getSegment(index));

      index = tile.get('segments')[directionFace.faces[1].name];
      result.push(app.game.getSegment(index));

      index = tile.get('segments')[directionFace.faces[2].name];
      result.push(app.game.getSegment(index));

      return result;
    },

    isNewTileValidDrop: function (t1, t2) {
      return !_.find(app.DirectionFaces, function (directionFace, directionName) {
        var adjacentNeighbor = t1.getAdjacentNeighbor(directionName);
        if (app.Tile.isTileStateOccupied(adjacentNeighbor)) {

          var adjacentTilesSegments = app.Tile.getDirectionFaceSegmentsForTile(adjacentNeighbor, app.DirectionFaces[directionFace.opposite]);
          var thisTilesSegments = app.Tile.getDirectionFaceSegmentsForTile(t2, directionFace);

          return thisTilesSegments[1].get('type') !== adjacentTilesSegments[1].get('type');
        } else {
          return false;
        }
      });

    },

    assignTileToOtherTile: function (t1, t2) {

      // Assign the drop tile segment links to the new domID found in t1
      _.each(t2.get('segments'), function (segmentId, dir) {
        var segment = app.game.getSegment(segmentId);
        if (segment) {
          segment.get('connectedTiles')[0] = t1.id;
        }
      }, t1);

      // Assign this models tile info with the tile that was passed into this method
      t1.set({
        class: t2.get('class'),
        segments: t2.get('segments'),
        rotation: t2.get('rotation'),
        state: app.TileState.occupied
      });
    },

    isTileStateOccupied: function (tile) {
      return (tile && tile.get('state') === app.TileState.occupied);
    },

    isTileStateUnoccupied: function (tile) {
      return (tile && tile.get('state') === app.TileState.unoccupied);
    },

    isTileStateUndefined: function (tile) {
      return (tile && tile.get('state') === app.TileState.undefined);
    }


  });
})();