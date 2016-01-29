var app = app || {};
(function () {
  'use strict';
  app.Segment = Backbone.Model.extend({
    defaults: {
      id: -1,
      type: undefined
    }
  });
})();