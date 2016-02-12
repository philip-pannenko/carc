var app = app || {};
(function ($) {
  'use strict';
  app.NextPlayableTileView = Backbone.View.extend({
    el: '#nextPlayableTile',
    model: app.Tile,
    initialize: function () {
      this.model.on('change:currentTurnTile', this.render, this);
      this.model.on('change:rotation', this.render, this);
      Backbone.on('compareTileToCurrentTurnTile', this.model.compareTileToCurrentTurnTile, this.model);
      Backbone.on('rotate', this.model.rotate, this.model);
      this.render();
    },
    render: function () {
      this.$el.removeClass();
      this.$el.addClass('tile ' + this.model.get('class') + ' _' + this.model.get('rotation').id);
    },
    //rotate: function (e) {
    //  this.model.rotate(e.currentTarget.id);
    //  this.render();
    //}
  });
})(jQuery);