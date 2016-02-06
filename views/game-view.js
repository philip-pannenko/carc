var app = app || {};
(function ($) {
  'use strict';
  app.GameView = Backbone.View.extend({
    el: '#container',
    model: app.Game,
    events: {
      'click button.rotate': 'rotate'
    },
    initialize: function () {
      //Backbone.on('initializeSegment', this.initializeSegment, this);
      Backbone.on('nextTurn', this.nextTurn, this);
      var clonedPlayableTile = JSON.parse(JSON.stringify(app.PlayableTiles.one_face_castle_with_straight_road));
      this.model = new app.Game();
      this.model.set('segments', new app.Segments());
      this.model.set('gridView', new app.GridView({tile: this.model.get('nextPlayableTiles').pop()}));
      this.model.set('nextPlayableTileView', new app.NextPlayableTileView({model: this.model.get('nextPlayableTiles').pop()}));
    },
    rotate: function (e) {
      Backbone.trigger('rotate', e);
    },
    nextTurn: function () {
      debugger;
      this.model.get('nextPlayableTileView').model = this.model.get('nextPlayableTiles').pop()
      this.model.get('nextPlayableTileView').render();
    },
    //,
    //initializeSegment: function(segments) {
    //
    //  _.each(segments, function(segment) {
    //    var segmentModel = new app.Segment({id: app.SEGMENT_SEQ_NUM++, type: segment.type})
    //  });
    //
    //
    //  this.model.get('segments').push()
    //}
  });
})(jQuery);