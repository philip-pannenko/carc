var app = app || {};
(function () {
  'use strict';
  app.Segment = Backbone.Model.extend({
    defaults: function () {
      return {
        'id': -1,
        'owned': undefined,
        'type': undefined,
        'connected': []
      }
    }
  });
})();