var app = app || {};
(function ($) {
  'use strict';
  app.GameView = Backbone.View.extend({
    el: '#container',
    model: app.Game,
    events: {
      'click button.rotate': 'rotate',
      'click button.skip': 'skipTurn'
    },

    initialize: function () {

      Backbone.on('tilePlacedOnGrid', this.tilePhase, this);
      Backbone.on('pawnPlacedOnGrid', this.nextTurn, this);

      this.$nextPlayableTile = this.$('#nextPlayableTile');
      this.$gamePhase = this.$('.game-phase');

      this.model.set('gridView', new app.GridView());
      this.model.set('nextPlayableTileView', new app.NextPlayableTileView({model: this.model.get('nextPlayableTiles').pop()}));

      this.model.on('change:gameState', this.render, this);

      this.render();
    },
    rotate: function (e) {
      Backbone.trigger('rotate', e);
    },

    skipTurn: function (e) {
      this.nextTurn();
    },

    render: function () {

      this.$nextPlayableTile.html(this.model.get('nextPlayableTileView').render().el);
      this.$gamePhase.html('<p> Game Phase ' + this.model.get('gameState') + ' </p>');

      //update the score

      //update the players turn

    },

    tilePhase: function (tile) {
      if (app.DEBUG_SEGMENT) {
        Backbone.trigger('refreshGrid');
      }

      this.model.set('gameState', app.GameState.pawnPlacement);

      app.game.recentlyPlacedTile = tile;
      app.game.recentlyPlacedTile.set('isPawnTarget', true);

    },

    nextTurn: function () {
      var view = this.model.get('nextPlayableTileView');
      if (view) {
        view.destroy();
      }
      app.game.recentlyPlacedTile = null;

      this.model.set('nextPlayableTileView', new app.NextPlayableTileView({model: this.model.get('nextPlayableTiles').pop()}));
      this.model.set('gameState', app.GameState.tilePlacement);

    }
  });
})(jQuery);