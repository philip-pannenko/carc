var app = app || {};
(function () {
  'use strict';
  app.Game = Backbone.Model.extend({
      defaults: function () {
        return {
          'segments': new app.Segments(),
          'nextPlayableTiles': new app.NextPlayableTiles(),
          'tiles': new app.Tiles(),
          'gameState': app.GameState.pawnPlacement,
          'recentlyPlacedTile': null
        }
      },

      initialize: function () {

        var firstTile = JSON.parse(JSON.stringify(app.PlayableTiles.one_face_castle_with_straight_road));
        var tile = this.createTileModelFromData(firstTile);
        // make each tile
        _.each(app.PlayableTiles, function (playableTile) {
          // make an appropriate amount of each tiles based on count
          for (var i = 0; i < playableTile.count; i++) {
            // deep object clone
            this.get('nextPlayableTiles').push(this.createTileModelFromData(playableTile));
          }
        }, this);
        // shuffle all
        //this.get('nextPlayableTiles').reset(this.get('nextPlayableTiles').shuffle(), {silent: true});
        // add first tile

        this.get('nextPlayableTiles').push(tile);
      },

      createTileModelFromData: function (playableTile) {
        var clonedPlayableTile = JSON.parse(JSON.stringify(playableTile));
        // First create the  tile
        var nextPlayableTile = new app.Tile({
          id: app.PLAYABLE_TILE_SEGMENT_SEQ_NUM++,
          class: clonedPlayableTile.class,
          segments: clonedPlayableTile.segmentIndexByCoordinate
        });


        var segmentsWithAssociatedDirections = {};
        _.each(nextPlayableTile.get('segments'), function (segment, dir, list) {
          if (!segmentsWithAssociatedDirections[segment]) {
            segmentsWithAssociatedDirections[segment] = [];
          }
          segmentsWithAssociatedDirections[segment].push(dir);
        }, segmentsWithAssociatedDirections);

        // Then create separate segments for the associated tile
        for (var i = 0; i < clonedPlayableTile.segments.length; i++) {
          var segment = clonedPlayableTile.segments[i];
          var segmentModel = new app.Segment({
            id: app.SEGMENT_SEQ_NUM++,
            type: segment.type,
            connectedTiles: [-1]
          });

          this.get('segments').push(segmentModel);
          _.each(segmentsWithAssociatedDirections[i], function (dir) {
            nextPlayableTile.get('segments')[dir] = segmentModel.id;
          }, this);
        }
        return nextPlayableTile;
      },

      //toggleNextGameState: function () {
      //  if (this.get('gameState') === app.GameState.pawnPlacement) {
      //    this.set('gameState', app.GameState.tilePlacement);
      //  } else if (this.get('gameState') === app.GameState.tilePlacement) {
      //    this.set('gameState', app.GameState.pawnPlacement);
      //  } else {
      //    console.error('invalid state');
      //  }
      //},

      isGameStateTile: function () {
        return this.get('gameState') === app.GameState.tilePlacement;
      },

      isGameStatePawn: function () {
        return this.get('gameState') === app.GameState.pawnPlacement;
      },

      getSegment: function (id) {
        return this.get('segments').get(id);
      },

      getTile: function (id) {
        return this.get('tiles').get(id);
      }

    }, {}
  );
})();