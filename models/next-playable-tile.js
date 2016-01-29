var app = app || {};
(function () {
  'use strict';
  app.NextPlayableTile = Backbone.Model.extend({
    defaults: {
      playableTiles: undefined,
      currentTurnTile: undefined
    },
    initialize: function () {
      var tempPlayableTiles = new Array();
      _.each(app.PlayableTiles, function (playableTile) {
        for (var i = 0; i < playableTile.count; i++) {
          var clonedPlayableTile = _.clone(playableTile);
          clonedPlayableTile.faces = _.clone(clonedPlayableTile.faces);
          tempPlayableTiles.push(clonedPlayableTile);
        }
      }, this);
      this.set('playableTiles', _.shuffle(tempPlayableTiles));
      this.set('currentTurnTile', this.get('playableTiles').shift());
    }
  });
})();