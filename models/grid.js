var app = app || {};
(function () {
  'use strict';
  app.Grid = Backbone.Model.extend({
    defaults: {
      row: undefined,
      col: undefined,
      totalColumnCount: undefined,
      totalRowCount: undefined,
      newTiles: []
    }
  });
})();