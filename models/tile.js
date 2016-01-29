var app = app || {};
(function () {
  'use strict';
  app.Tile = Backbone.Model.extend({
    defaults: {
      id: -1,
      name: undefined,
      isPlayable: false,
      isPlaced: false,
      placedTile: undefined,
      adjacentNeighbors: undefined
    },
    initialize: function () {
      this.set('adjacentNeighbors', {});
    }
  });
})();