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
      this.$nextPlayableTile = this.$('#nextPlayableTile');
      this.model = new app.Game();
      this.model.set('gridView', new app.GridView({tile: this.model.get('nextPlayableTiles').pop()}));
      this.nextTurn();
    },
    rotate: function (e) {
      Backbone.trigger('rotate', e);
    },
    nextTurn: function () {
      debugger;
      var view = this.model.get('nextPlayableTileView');
      if(view) {
        view.destroy();
      }
      view = new app.NextPlayableTileView({model: this.model.get('nextPlayableTiles').pop()});
      this.model.set('nextPlayableTileView', view);
      this.$nextPlayableTile.append(view.render().el);
    }
  });
})(jQuery);