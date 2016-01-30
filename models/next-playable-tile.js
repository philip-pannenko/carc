var app = app || {};
(function () {
  'use strict';
  app.NextPlayableTile = Backbone.Model.extend({
    defaults: {
      playableTiles: undefined,
      currentTurnTile: undefined

    },
    initialize: function () {

      var tempPlayableTiles = [];
      _.each(app.PlayableTiles, function (playableTile) {
        for (var i = 0; i < playableTile.count; i++) {
          var clonedPlayableTile = _.clone(playableTile);
          clonedPlayableTile.faces = _.clone(clonedPlayableTile.faces);
          clonedPlayableTile.rotation = app.Rotation._0;
          tempPlayableTiles.push(clonedPlayableTile);
        }
      }, this);
      this.set('playableTiles', _.shuffle(tempPlayableTiles));
      this.set('currentTurnTile', this.get('playableTiles').shift());
    }
  });
})();