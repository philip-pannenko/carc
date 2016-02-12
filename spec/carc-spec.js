//describe('OverlayView', function() {
//
//  var view;
//  beforeEach(function() {
//    view = new OverlayView();
//    setFixtures(sandbox({ id: 'sandbox' }));
//    $('#sandbox').append(view.$el);
//  });
//
//  it('should exist', function() {
//    expect(view).toBeDefined();
//  });
//
//  it('should be a Backbone.View instance', function() {
//    expect(view instanceof Backbone.View).toBe(true);
//  });
//
//  it('should have a .modalView class attached', function() {
//    expect(view.$el.hasClass('modalView')).toBe(true);
//  });
//
//
//  describe('behaviour', function() {
//
//    it('should be hidden by default', function() {
//      expect(view.isHidden).toBe(true);
//      expect(view.$el.css('display')).toEqual('none');
//    });
//
//    it('should be visible once shown', function() {
//      view.show();
//      expect(view.isHidden).toBe(false);
//      expect(view.$el.css('display')).toEqual('block');
//    });
//
//    it('should be invisible once hidden', function() {
//      view.hide();
//      expect(view.isHidden).toBe(true);
//      expect(view.$el.css('display')).toEqual('none');
//    });
//
//    it('should have a close button', function() {
//      expect(view.$el.find('.close').length).toBe(1);
//    });
//
//    it('should hide itself when close button is clicked', function() {
//      var but = view.$el.find('.close');
//      but.trigger('click');
//      expect(view.isHidden).toBe(true);
//      expect(view.$el.css('display')).toEqual('none');
//    });
//
//  });
//
//});

describe('GameModel', function () {

  var game;
  beforeEach(function () {
    game = new app.Game();
  });

  it('should exist', function () {
    expect(game).toBeDefined();
  });

  it('should be a Backbone.Model instance', function () {
    expect(game instanceof Backbone.Model).toBe(true);
  });

  describe('behaviour', function () {

    it('should have 73 tiles defined', function () {
      expect(game.get('nextPlayableTiles').length).toEqual(73);
    });

    it('should have 314 segments defined', function () {
      expect(game.get('segments').length).toEqual(314);
    });

    //it('should have different segment instances', function() {
    //  var t0 = game.get('nextPlayableTiles').get(0);
    //  var t0 = game.get('nextPlayableTiles').get(1);
    //  var t0 = game.get('nextPlayableTiles').get(2);
    //  var t0 = game.get('nextPlayableTiles').get(3);
    //  var t0 = game.get('nextPlayableTiles').get(4);
    //
    //  expect();
    //})

    it('should have shared segment object references between next playable tiles and segment collection', function () {
      var result = game.get('nextPlayableTiles').find(function (nextPlayableTile) {
        return nextPlayableTile.get('segments').find(function (segment) {
          return this.get('segments').get(segment.id) !== segment;
        }, this);
      }, game);
      expect(result).toBeFalsy();
    });

    it('should have next playable tiles with unique {} and [] instances', function () {
      var tiles = game.get('nextPlayableTiles').where({class: 'one-face-castle-with-straight-road'});
      var result = tiles.find(function (tile) {
        var result =
          tile.get('adjacentNeighbors')[app.Direction.TL] === 'test' ||
          tile.get('faces')[app.Direction.TL] === 'test' ||
          tile.get('segments')[0] === 'test';

        tile.get('adjacentNeighbors')[app.Direction.TL] = 'test';
        tile.get('faces')[app.Direction.TL] = 'test';
        tile.get('segments')[0] = 'test';

        return result;

      });

      expect(result).toBeFalsy();

    });

    it('should have a defined first playing piece', function () {
      expect(game.get('nextPlayableTiles').pop().get('class')).toEqual('one-face-castle-with-straight-road');
    });

  });

});

describe('TileModel', function () {

  var tile;
  beforeEach(function () {
    tile = new app.Tile();
  });

  it('should exist', function () {
    expect(tile).toBeDefined();
  });

  it('should be a Backbone.Model instance', function () {
    expect(tile instanceof Backbone.Model).toBe(true);
  });

  describe('behaviour', function () {
    it('should rotate correctly', function () {

      var CW = {currentTarget: {id: 'CW'}};
      var CCW = {currentTarget: {id: 'CCW'}};
      expect(tile.get('rotation')).toEqual(app.Rotation._0);
      tile.rotate(CW);
      expect(tile.get('rotation')).toEqual(app.Rotation._90);
      tile.rotate(CW);
      expect(tile.get('rotation')).toEqual(app.Rotation._180);
      tile.rotate(CW);
      expect(tile.get('rotation')).toEqual(app.Rotation._270);
      tile.rotate(CW);
      expect(tile.get('rotation')).toEqual(app.Rotation._0);
      tile.rotate(CCW);
      expect(tile.get('rotation')).toEqual(app.Rotation._270);
      tile.rotate(CCW);
      expect(tile.get('rotation')).toEqual(app.Rotation._180);
      tile.rotate(CCW);
      expect(tile.get('rotation')).toEqual(app.Rotation._90);
      tile.rotate(CCW);
      expect(tile.get('rotation')).toEqual(app.Rotation._0);
      tile.rotate(CCW);
      expect(tile.get('rotation')).toEqual(app.Rotation._270);
    });
  });

});