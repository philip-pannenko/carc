var app = app || {};
(function () {
  'use strict';
  app.Segment = Backbone.Model.extend({
    defaults: {
      id: -1,
      owned: undefined,
      type: undefined,
      connected: undefined
    },
    initialize: function () {
      this.set('connected', []);
    }
  });
})();