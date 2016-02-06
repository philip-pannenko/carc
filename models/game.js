var app = app || {};
(function () {
  'use strict';
  app.Game = Backbone.Model.extend({
    initialize: function () {
      this.set('segments', new app.Segments());
      this.set('nextPlayableTiles', new app.NextPlayableTiles);
      var clonedPlayableTile = JSON.parse(JSON.stringify(app.PlayableTiles.one_face_castle_with_straight_road));
      var tile = new app.Tile({
        faces: clonedPlayableTile.faces,
        class: clonedPlayableTile.class,
        segments: []
      });
      for (var segment in clonedPlayableTile.segments) {
        var segmentModel = new app.Segment({id: app.SEGMENT_SEQ_NUM++, type: segment.type});
        this.get('segments').push(segmentModel);
        tile.get('segments').push(segmentModel);
      }
      // make each tile
      _.each(app.PlayableTiles, function (playableTile) {
        // make an appropriate amount of each tiles based on count
        for (var i = 0; i < playableTile.count; i++) {
          // deep object clone
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
          this.get('nextPlayableTiles').push(nextPlayableTile);
        }
      }, this);
      // shuffle all
      this.get('nextPlayableTiles').reset(this.get('nextPlayableTiles').shuffle(), {silent: true});
      // add first tile
      this.get('nextPlayableTiles').push(tile);
    }
  });
})();