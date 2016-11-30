var app = app || {};
(function () {
  'use strict';
  app.Segments = Backbone.Collection.extend({
    // Save all of the todo items under this example's namespace.
    localStorage: new Backbone.LocalStorage('segments-backbone'),

    model: app.Segment
  });
})();