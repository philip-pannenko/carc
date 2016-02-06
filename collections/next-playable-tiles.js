var app = app || {};
(function () {
  'use strict';
  app.NextPlayableTiles = Backbone.Collection.extend({
    model: app.Tile
  });
})();