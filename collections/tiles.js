var app = app || {};
(function () {
  'use strict';
  app.Tiles = Backbone.Collection.extend({
    model: app.Tile
  });
})();