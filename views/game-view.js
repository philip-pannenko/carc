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
      Backbone.on('nextTurn', this.nextTurn, this);
      this.model = new app.Game();
      this.model.set('gridView', new app.GridView({tile: this.model.get('nextPlayableTiles').pop()}));
      this.model.set('nextPlayableTileView', new app.NextPlayableTileView({model: this.model.get('nextPlayableTiles').pop()}));
    },
    rotate: function (e) {
      Backbone.trigger('rotate', e);
    },
    nextTurn: function () {
      this.model.get('nextPlayableTileView').model = this.model.get('nextPlayableTiles').pop()
      this.model.get('nextPlayableTileView').render();
    }
  });
})(jQuery);