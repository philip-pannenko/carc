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
      debugger;
      this.$el.removeClass();
      if (this.model.get('state') === app.TileState.unoccupied) {
        this.$el.addClass('playable');
      } else if (this.model.get('state') === app.TileState.occupied) {
        this.$el.addClass('tile ' + this.model.get('class') + ' _' + this.model.get('rotation').id);
      }
      this.$el.html(this.model.get('id'));
    },
    tileClicked: function () {
      debugger;
      if (this.model.get('state') === app.TileState.unoccupied) {
        Backbone.trigger('compareTileToCurrentTurnTile', this.model);
        if (this.model.get('state') === app.TileState.occupied) {
          Backbone.trigger('tilePlaced', this.el);
        }
      } else {
        //console.log('not legit move');
      }
    }
  });
})(jQuery);