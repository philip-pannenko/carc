var app = app || {};
(function () {
  'use strict';
  app.Tile = Backbone.Model.extend({
    defaults: {
      id: -1,
      name: undefined,
      placedTile: undefined,
      adjacentNeighbors: undefined,
      state: undefined
    },
    initialize: function () {
      this.set('adjacentNeighbors', {});
    }
  });
})();