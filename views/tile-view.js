var app = app || {};
(function ($) {
  'use strict';
  app.TileView = Backbone.View.extend({
    events: {
      'click': 'tileClicked'
    },

    model: app.Tile,

    initialize: function () {
      this.model.on('change', this.render, this);
      Backbone.on('assignNeighboringTilesWithOneAnother:' + this.model.id, this.model.assignNeighboringTilesWithOneAnother, this.model);
    },

    render: function () {
      this.$el.removeClass();
      if (this.model.get('state') === app.TileState.unoccupied) {
        this.$el.addClass('playable');
      } else if (this.model.get('state') === app.TileState.occupied) {
        this.$el.addClass('tile ' + this.model.get('class') + ' ' + this.model.get('rotation').name);
      }
      this.$el.html(this.model.get('id'));
    },

    tileClicked: function () {
      if (this.model.get('state') === app.TileState.unoccupied) {
        Backbone.trigger('compareTileToCurrentTurnTile', this.model);
        if (this.model.get('state') === app.TileState.occupied) {
          Backbone.trigger('tilePlaced', this.el);
        }
      } else {
        //console.log('not legit move');
      }
    },

    updateNewTilesNeighbor: function(totalColumnCount, totalRowCount) {
      _.each(app.Direction, function (dir, dirName) {
        var x = this.el.cellIndex;
        var y = this.el.parentNode.rowIndex;
        var neigh_x = x + dir.x;
        var neigh_y = y + dir.y;
        if (!(neigh_x < 0 || neigh_x === totalColumnCount || neigh_y < 0 || neigh_y === totalRowCount || (neigh_y === y && neigh_x === x ))) {
          var neighborTileId = dir.getElId(this.el, x);
          Backbone.trigger('assignNeighboringTilesWithOneAnother:' + neighborTileId, {tile: this.model, dir:dir});
        }
      }, this);
    }
  });
})(jQuery);