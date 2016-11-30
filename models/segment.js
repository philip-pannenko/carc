var app = app || {};
(function () {
  'use strict';
  app.Segment = Backbone.Model.extend({
    defaults: function () {
      return {
        'id': -1,
        'owned': false,
        'type': undefined, // app.SegmentType
        'connectedTiles': [] // tile.id
      }
    },

    getConnectedTiles: function (id) {
      app.game.get('segments').get(id);
    },

    mergeWithSegment: function (segment) {
      var mergeSegment = segment;

      // If the aren't the same already, merge them
      if (this.id !== mergeSegment.id) {
        console.log('Segment ' + this.id + ' will merge with Segment' + mergeSegment.id);

        this.set('owned', mergeSegment.get('owned'), {silent: true});

        // Get the connected tiles associated with this segment
        _.each(this.get('connectedTiles'), function (connectedTileId) {

          // Go through each of the segments of the connected tiles
          // so that we can find the segment to merge
          var connectedTile = app.game.getTile(connectedTileId);
          console.log('Going through Segment ' + this.id + '\'s connected Tile ' + connectedTileId + ' segments');
          _.each(connectedTile.get('segments'), function (segmentId, dir, segments) {
            if (segmentId === this.id) {
              console.log('Updating Tile ' + connectedTileId + '\'s segments[' + dir +'] with merge Segment ' + mergeSegment.id);
              segments[dir] = mergeSegment.id; // update the tiles.segments with this segment's id
            }
          }, this);
          mergeSegment.get('connectedTiles').push(connectedTile.id);
        }, this)
      }
    }
  });
})();