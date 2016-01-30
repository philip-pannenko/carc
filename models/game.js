var app = app || {};
(function () {
  'use strict';
  app.Game = Backbone.Model.extend({
    defaults: {
      availableTiles: undefined,
      segments: undefined
    },
    initialize: function () {

      this.set('availableTiles', {});
      this.set('segments', new app.Segments());

      // make each tile
      _.each(app.PlayableTiles, function (playableTile) {
        // make an appropriate amount of each tiles based on count
        for (var i = 0; i < playableTile.count; i++) {
          // deep object clone
          var clonedPlayableTile = JSON.parse(JSON.stringify(playableTile));
          // pre add the segment to a list of segments
          _.each(clonedPlayableTile.segments, function(segment) {
            // append an id to this tiles segment
            segment.id = app.SEGMENT_SEQ_NUM++;
            // add the segment to our games collection
            this.get('segments').push(new app.Segment({id: segment.id, type: segment.type}));
          }, this);
        }
      }, this);

    }
  });
})();