var app = app || {};
(function () {
  'use strict';
  app.Game = Backbone.Model.extend({
    defaults: function () {
      return {
        'segments': new app.Segments(),
        'nextPlayableTiles': new app.NextPlayableTiles()
      }
    },
    initialize: function () {
      var firstTile = JSON.parse(JSON.stringify(app.PlayableTiles.one_face_castle_with_straight_road));
      var tile = this.createTileModelFromData(firstTile);
      // make each tile
      _.each(app.PlayableTiles, function (playableTile) {
        // make an appropriate amount of each tiles based on count
        for (var i = 0; i < playableTile.count; i++) {
          // deep object clone
          this.get('nextPlayableTiles').push(this.createTileModelFromData(playableTile));
        }
      }, this);
      // shuffle all
      this.get('nextPlayableTiles').reset(this.get('nextPlayableTiles').shuffle(), {silent: true});
      // add first tile
      this.get('nextPlayableTiles').push(tile);
    },
    createTileModelFromData: function (playableTile) {
      var clonedPlayableTile = JSON.parse(JSON.stringify(playableTile));
      var nextPlayableTile = new app.Tile({
        id: app.PLAYABLE_TILE_EGMENT_SEQ_NUM++,
        faces: clonedPlayableTile.faces,
        class: clonedPlayableTile.class
      });
      for (var segment in clonedPlayableTile.segments) {
        var segmentModel = new app.Segment({id: app.SEGMENT_SEQ_NUM++, type: segment.type});
        this.get('segments').push(segmentModel);
        nextPlayableTile.get('segments').push(segmentModel);
      }
      return nextPlayableTile;
    }
  });
})();