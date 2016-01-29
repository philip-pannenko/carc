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
      this.model = new app.Game();
      this.model.set('gridView', new app.GridView());
      this.model.set('nextPlayableTileView', new app.NextPlayableTileView());
    },
    rotate: function (e) {
      Backbone.trigger('rotate', e);
    }
  });
})(jQuery);