var app = app || {};
(function ($) {
  'use strict';
  app.TileView = Backbone.View.extend({
    events: {
      'click .pawn': 'pawnDrop',
      'click': 'tileClicked'
    },

    model: app.Tile,

    initialize: function () {
      this.model.on('change', this.render, this);
      this.model.on('change:isPawnTarget', this.render, this);
      Backbone.on('refreshGrid', this.render, this);
    },

    pawnDrop: function (e) {

      var coordinate = _.indexBy(app.Direction, 'fullName')[e.currentTarget.classList[1]];
      var segmentId = this.model.getSegmentByTileCoordinate(coordinate);

      if (segmentId === -1) {
        console.log('Cannot place pawn here');
      } else if (app.game.getSegment(segmentId).get('owned')) {
        console.log('Segment already owned');
      } else {
        app.game.getSegment(segmentId).save({owned: true});

        // Assign it to the Tile
        this.model.set('pawnCoordinates', coordinate, {silent: true});
        this.model.set('isPawnTarget', false, {silent: true});

        // Trigger an event to the Grid
        Backbone.trigger('pawnPlacedOnGrid');

        // Render the Tile after Grid has updated.
        this.render();
      }

      // Prevent further Tile-View click events from propagating
      return false;
    },

    render: function () {
      this.$el.removeClass();

      this.$el.empty();
      if (app.DEBUG_TILE) {
        var debugTile = $('<span />').addClass('debugTile').css('position', 'absolute').html(this.model.get('id'));
        this.$el.append(debugTile);
      } else {
        //this.$el.find('.debugTile').remove();
      }

      if (app.Tile.isTileStateOccupied(this.model)) {

        var _00, _01, _02, _10, _11, _12, _20, _21, _22;
        _00 = this.model.get('segments')['TL'];
        _01 = this.model.get('segments')['T'];
        _02 = this.model.get('segments')['TR'];
        _10 = this.model.get('segments')['L'];
        _11 = this.model.get('segments')['C'];
        _12 = this.model.get('segments')['R'];
        _20 = this.model.get('segments')['BL'];
        _21 = this.model.get('segments')['B'];
        _22 = this.model.get('segments')['BR'];

        if (app.game.isGameStatePawn() && this.model.id === app.game.recentlyPlacedTile.id) {


          var dropPawnTarget;
          if (app.DEBUG_SEGMENT) {
            dropPawnTarget = $('<span />').addClass('debugSegment').addClass('pawn-drop-grid').css('position', 'absolute').css('z-index', '5').html(
              '<table class="debug"> <tbody>' +
              '<tr><td class="pawn top-left">' + _00 + '</td><td  class="pawn top">' + _01 + '</td><td class="pawn top-right">' + _02 + '</td></tr>' +
              '<tr><td class="pawn left">' + _10 + '</td><td class="pawn center">' + _11 + '</td><td class="pawn right">' + _12 + '</td></tr>' +
              '<tr><td class="pawn bottom-left">' + _20 + '</td><td class="pawn bottom">' + _21 + '</td><td class="pawn bottom-right">' + _22 + '</td></tr>' +
              '</tbody></table>');

          } else {
            dropPawnTarget = $('<span />').addClass('pawn-drop-grid').html(
              '<table><tbody>' +
              '<tr><td class="pawn top-left"></td><td class="pawn top"></td><td class="pawn top-right"></td></tr>' +
              '<tr><td class="pawn left"></td><td class="pawn center" ></td><td class="pawn right" ></td></tr>' +
              '<tr><td class="pawn bottom-left"></td><td class="pawn bottom"></td><td class="pawn bottom-right"></td></tr>' +
              '</tbody></table>');
          }

          this.$el.append(dropPawnTarget);

        } else if (app.DEBUG_SEGMENT) {

          var debugSegment = $('<span />').addClass('debugSegment').css('position', 'absolute').css('z-index', '5').html(
            '<table class="debug"> <tbody>' +
            '<tr><td>' + _00 + '</td><td>' + _01 + '</td><td>' + _02 + '</td></tr>' +
            '<tr><td>' + _10 + '</td><td>' + _11 + '</td><td>' + _12 + '</td></tr>' +
            '<tr><td>' + _20 + '</td><td>' + _21 + '</td><td>' + _22 + '</td></tr>' +
            '</tbody></table>');
          this.$el.append(debugSegment);
        }

      }


      if (app.Tile.isTileStateUnoccupied(this.model)) {
        this.$el.addClass('playable');
      } else if (app.Tile.isTileStateOccupied(this.model)) {

        var span = $('<span />').addClass('tile ' + this.model.get('class') + ' ' + this.model.get('rotation'));

        if (this.model.get('pawnCoordinates')) {
          this.$el.append($('<span/>').addClass('pawn-spot ' + this.model.get('pawnCoordinates').fullName));
        }

        this.$el.append(span);

      }


    },

    tileClicked: function (e) {
      if (app.game.isGameStateTile()) {
        if (app.Tile.isTileStateUnoccupied(this.model)) {
          Backbone.trigger('compareTileToCurrentTurnTile', this.model);
          if (app.Tile.isTileStateOccupied(this.model)) {

            Backbone.trigger('placeTile', this.el);
          } else {
            console.log('Cannot place tile here');
          }
        } else {
          console.log('No tile can be placed here');
        }
      } else if (app.game.isGameStatePawn() && this.model.id === app.game.recentlyPlacedTile.id) {
        console.log('place your pawn here!');
      } else {
        console.log('Wrong game phase to play tile');
      }
    },

    getTileXYCoordinates: function () {
      return {x: this.el.cellIndex, y: this.el.parentNode.rowIndex};
    }
  });
})(jQuery);