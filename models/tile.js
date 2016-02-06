var app = app || {};
(function () {
  'use strict';
  app.Tile = Backbone.Model.extend({
    defaults: {
      id: -1,
      name: "",
      adjacentNeighbors: undefined,
      class: "",
      faces: undefined,
      segments: undefined,
      state: undefined,
      rotation: undefined
    },
    initialize: function (data, options) {
      if (options) {
        if (options.create === 'nextPlayableTile') {
          this.set('id', app.PLAYABLE_TILE_EGMENT_SEQ_NUM++);
        }
      }
      if (!this.get('state')) {
        console.log('1');
        this.set('state', app.TileState.undefined);
      }
      if (!this.get('segments')) {
        this.set('segments', []);
        console.log('2');
      }
      if (!this.get('faces')) {
        this.set('faces', {});
        console.log('3');
      }
      if (!this.get('adjacentNeighbors')) {
        this.set('adjacentNeighbors', {});
        console.log('4');
      }
      if (!this.get('rotation')) {
        this.set('rotation', app.Rotation._0);
        console.log('5');
      }
      // var app = app || {};
// (function () {
      // 'use strict';
      // app.Tile = Backbone.Model.extend({
      // defaults: function() {
      // return {
      // id: -1,
      // 'segments': [],
      // 'faces': {},
      // 'adjacentNeighbors': {},
      // 'rotation': app.Rotation._0
      // };
      // }
      // });
// })();
    }
  });
})();