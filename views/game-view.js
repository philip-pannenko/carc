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

      this.model = new app.Game();
      this.model.set('segments', new app.Segments());
      this.model.set('gridView', new app.GridView());
      this.model.set('nextPlayableTileView', new app.NextPlayableTileView());
    },
    rotate: function (e) {
      Backbone.trigger('rotate', e);
    }
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