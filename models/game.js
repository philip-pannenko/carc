var app = app || {};
(function () {
  'use strict';
  app.Game = Backbone.Model.extend({
    defaults: {
      availableTiles: undefined,
      segments: undefined
    },
    initialize: function () {

      debugger;


      this.availableTiles = {}
      this.segments = {}


      var tempPlayableTiles = new Array();
      _.each(app.PlayableTiles, function (playableTile) {

        for (var i = 0; i < playableTile.count; i++) {
          var clonedPlayableTile = _.clone(playableTile);

          if (clonedPlayableTile.class === 'one-face-castle-with-straight-road') {
            clonedPlayableTile.segments = {};
            var j = 1;
            _.each(playableTile.segments, function(segment) {
              clonedPlayableTile.segments[j] = _.clone(segment);
              j++;
            });

            debugger;
            //
            //class: 'one-face-castle-with-straight-road',
            //    count: 4,
            //    faces: {
            //    T: {face: 'FRF', segment: [1, 2, 3]},
            //    R: {face: 'FFF', segment: [3]},
            //    B: {face: 'FRF', segment: [1, 2, 3]},
            //    L: {face: 'CCC', segment: [4]}
            //  },
            //  segments: {1: {type: 'F'}, 2: {type: 'R'}, 3: {type: 'F'}, 4: {type: 'C'}}
            //

            _.each(app.NeighborDirection, function (dir) {

              debugger;
              _.each(clonedPlayableTile.faces[dir.dir.name].segments, function(segmentIndex) {
                var segment = clonedPlayableTile.segments[segmentIndex];
                if(!segment.id) {
                  segment.id = app.SEGMENT_SEQ_NUM++
                  this.segments[segment.id] = segment;
                }
              }, this);



            }, this);
          }
          clonedPlayableTile.faces = _.clone(clonedPlayableTile.faces);
          tempPlayableTiles.push(clonedPlayableTile);
        }
      }, this);

    }
  });
})();