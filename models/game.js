var app = app || {};
(function () {
  'use strict';
  app.Game = Backbone.Model.extend({
    defaults: {
      availableTiles: undefined,
      segments: undefined
    },
    initialize: function () {

      this.availableTiles = {};
      this.segments = new app.Segments();

      var tempPlayableTiles = [];

      _.each(app.PlayableTiles, function (playableTile) {

        for (var i = 0; i < playableTile.count; i++) {
          var clonedPlayableTile = _.clone(playableTile);

          clonedPlayableTile.segments = [];
          _.each(playableTile.segments, function (segment) {
            clonedPlayableTile.segments.push(_.clone(segment));
          });

          _.map(app.NeighborDirection, function (dir, key) {

            _.each(clonedPlayableTile.faces[key].segments, function (segmentIndex) {
              var segment = clonedPlayableTile.segments[segmentIndex];
              var segmentVar = new app.Segment();
              if (!segment.id) {
                segment.id = app.SEGMENT_SEQ_NUM++
                this.segments.push(segment);
              }
            }, this);


          }, this);

          clonedPlayableTile.faces = _.clone(clonedPlayableTile.faces);
          tempPlayableTiles.push(clonedPlayableTile);
        }
      }, this);

      debugger;

    }
  });
})();