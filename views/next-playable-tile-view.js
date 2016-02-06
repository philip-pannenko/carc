var app = app || {};
(function ($) {
  'use strict';
  app.NextPlayableTileView = Backbone.View.extend({
    el: '#nextPlayableTile',
    model: app.Tile,
    initialize: function () {
      this.model.on('change:currentTurnTile', this.render, this);
      Backbone.on('compareTileToCurrentTurnTile', this.compareTileToCurrentTurnTile, this);
      Backbone.on('rotate', this.rotate, this);
      this.render();
    },
    render: function () {
      this.$el.removeClass();
      this.$el.addClass('tile ' + this.model.get('class') + ' _' + this.model.get('rotation').id);
    },
    rotate: function (e) {
      var id = e.currentTarget.id;
      this.model.set('rotation', this.model.get('rotation')[id]);
      var faces = this.model.attributes.faces;
      if (id === 'CW') {
        var temp = faces['T'];
        faces['T'] = faces['L'];
        faces['L'] = faces['B'];
        faces['B'] = faces['R'];
        faces['R'] = temp;
      } else if (id === 'CCW') {
        var temp = faces['T'];
        faces['T'] = faces['R'];
        faces['R'] = faces['B'];
        faces['B'] = faces['L'];
        faces['L'] = temp;
      }
      this.render();
    },
    compareTileToCurrentTurnTile: function (tile) {
      var foundConflictingNeighborFace = _.find(app.NeighborDirection, function (dir, key) {
        var adjacentNeighbor = tile.get('adjacentNeighbors')[key];
        if (adjacentNeighbor && adjacentNeighbor.get('state') === app.TileState.occupied) {
          var oppositeDir = dir.dir.opposite.name;
          var neighborFace = adjacentNeighbor.get('faces')[oppositeDir];
          var playableTileFace = this.model.get('faces')[key];
          return playableTileFace.face !== neighborFace.face;
        } else {
          return false;
        }
      }, this);
      if (!foundConflictingNeighborFace) {
        // assign this models tile info with the tile that was passed into this method
        tile.set({
          name: this.model.get('name'),
          class: this.model.get('class'),
          faces: this.model.get('faces'),
          segments: this.model.get('segments'),
          rotation: this.model.get('rotation'),
          state: app.TileState.occupied
        });
      }
    }
  });
})(jQuery);