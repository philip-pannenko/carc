var app = app || {};
(function ($) {
  'use strict';
  app.TileView = Backbone.View.extend({
    events: {
      'click': 'tileClicked'
    },
    model: app.Tile,
    initialize: function () {
      this.model.on('change', this.render, this);
    },
    render: function () {
      this.$el.removeClass();
      if (this.model.get('placedTile')) {
        this.$el.addClass(this.model.get('placedTile').rotation.class);
      }
      if (this.model.get('name')) {
        this.$el.addClass('tile ' + this.model.get('name'));
      }
      if (this.model.get('isPlayable') && !this.model.get('isPlacable')) {
        this.$el.addClass('playable');
      }
      this.$el.html(this.model.get('id'));
    },
    tileClicked: function () {
      if (this.model.get('isPlayable')) {
        var isTilePlaced = {isValid: true}; // used to determine if following triggers are performed
        console.log('this.model.id ' + this.model.id);
        _.map(app.NeighborDirection, function (dir, key) {
          Backbone.trigger('compareTileToCurrentTurnTile', [this.model, dir, key, isTilePlaced]);
        }, this);
        if (isTilePlaced.isValid) {
          Backbone.trigger('assignCurrentTileToTile', this.model);
          Backbone.trigger('tilePlaced', this.el);
        }
      } else {
        //console.log('not legit move');
      }
    }
  });
})(jQuery);