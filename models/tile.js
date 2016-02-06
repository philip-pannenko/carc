var app = app || {};
(function () {
  'use strict';
  app.Tile = Backbone.Model.extend({
    defaults: function() {
      return {
        'id': -1,
        'adjacentNeighbors': {},
        'class': "",
        'faces': {},
        'segments': [],
        'state': app.TileState.undefined,
        'rotation': app.Rotation._0}

    }
  });
})();