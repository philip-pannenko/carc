var app = app || {};
(function () {
  'use strict';
  app.Grid = Backbone.Model.extend({
    defaults: function () {
      return {
        'row': undefined,
        'col': undefined,
        'totalColumnCount': undefined,
        'totalRowCount': undefined
      }
    }
  });
})();