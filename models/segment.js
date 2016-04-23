var app = app || {};
(function () {
  'use strict';
  app.Segment = Backbone.Model.extend({
    defaults: function () {
      return {
        'id': -1,
        'owned': undefined,
        'type': undefined,
        'connectedTiles': []
      }
    },

    //incrementCount: function (increment) {
    //  this.set('connected', this.get('connected') + increment);
    //},
    //
    //decrementCount: function (decrement) {
    //  this.set('connected', this.get('connected') - decrement);
    //}

  });
})();