var app = app || {};
(function ($) {
  'use strict';
  app.TileView = Backbone.View.extend({
    events: {
      'click': 'tileClicked'
    },

    model: app.Tile,

    initialize: function () {
      this.DEBUG_SEGMENT = false;
      this.DEBUG_TILE = false;

      this.model.on('change', this.render, this);
      Backbone.on('assignNeighboringTilesWithOneAnother:' + this.model.id, this.model.assignNeighboringTilesWithOneAnother, this.model);
      Backbone.on('debugSegment', this.toggleDebugSegment, this);
      Backbone.on('debugTile', this.toggleDebugTile, this);
    },

    toggleDebugSegment: function() {
      this.DEBUG_SEGMENT = !this.DEBUG_SEGMENT;
      this.render();
    },

    toggleDebugTile: function() {
      this.DEBUG_TILE= !this.DEBUG_TILE;
      this.render();
    },

    render: function () {
      this.$el.removeClass();

      this.$el.empty();

      if(this.DEBUG_TILE) {
        var debugTile = $('<span />').addClass('debugTile').css('position','absolute').css('z-index', '1').html(this.model.get('id'));
        this.$el.append(debugTile);
      } else {
        this.$el.find('.debugTile').remove();
      }

      if(this.DEBUG_SEGMENT) {
        var debugSegment = $('<span />').addClass('debugSegment').css('position','absolute').css('z-index', '2').html('debugSegment');
        this.$el.append(debugSegment);
      } else {
        this.$el.find('.debugSegment').remove();
      }

      if (this.model.get('state') === app.TileState.unoccupied) {
        this.$el.addClass('playable');
      } else if (this.model.get('state') === app.TileState.occupied) {
        var span = $('<span />').addClass('tile ' + this.model.get('class') + ' ' + this.model.get('rotation').name);
        this.$el.append(span);
      }

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