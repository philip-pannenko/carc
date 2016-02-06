var app = app || {};
(function () {
  'use strict';
  app.Segments = Backbone.Collection.extend({
    model: app.Segment
  });
})();