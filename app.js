var app = app || {};
$(function () {
  'use strict';
  app.TILE_SEQ_NUM = 10;
  Array.prototype.clear = function () {
    this.splice(0, this.length);
  };
  app.Direction = {
    TL: {
      id: 1, name: 'TL', x: -1, y: -1, getElId: function (el, x) {
        return el.parentNode.previousElementSibling.children[x - 1].id
      }
    },
    T: {
      id: 2, name: 'T', x: 0, y: -1, getElId: function (el, x) {
        return el.parentNode.previousElementSibling.children[x].id
      }
    },
    TR: {
      id: 3, name: 'TR', x: 1, y: -1, getElId: function (el, x) {
        return el.parentNode.previousElementSibling.children[x + 1].id
      }
    },
    L: {
      id: 4, name: 'L', x: -1, y: 0, getElId: function (el) {
        return el.previousElementSibling.id
      }
    },
    C: {
      id: 5, name: 'C', x: 0, y: 0, getElId: function (el) {
        return el.id
      }
    },
    R: {
      id: 6, name: 'R', x: 1, y: 0, getElId: function (el) {
        return el.nextElementSibling.id
      }
    },
    BL: {
      id: 7, name: 'BL', x: -1, y: 1, getElId: function (el, x) {
        return el.parentNode.nextElementSibling.children[x - 1].id
      }
    },
    B: {
      id: 8, name: 'B', x: 0, y: 1, getElId: function (el, x) {
        return el.parentNode.nextElementSibling.children[x].id
      }
    },
    BR: {
      id: 9, name: 'BR', x: 1, y: 1, getElId: function (el, x) {
        return el.parentNode.nextElementSibling.children[x + 1].id;
      }
    }
  };
  app.Rotation = {
    _0: {id: 0, class: '_0'},
    _90: {id: 90, class: '_90'},
    _180: {id: 180, class: '_180'},
    _270: {id: 270, class: '_270'}
  };
  app.Direction.TL.opposite = app.Direction.BR;
  app.Direction.T.opposite = app.Direction.B;
  app.Direction.TR.opposite = app.Direction.BL;
  app.Direction.L.opposite = app.Direction.R;
  app.Direction.R.opposite = app.Direction.L;
  app.Direction.BL.opposite = app.Direction.TR;
  app.Direction.B.opposite = app.Direction.T;
  app.Direction.BR.opposite = app.Direction.TL;
  app.Rotation._0.CW = app.Rotation._90;
  app.Rotation._0.CCW = app.Rotation._270;
  app.Rotation._90.CW = app.Rotation._180;
  app.Rotation._90.CCW = app.Rotation._0;
  app.Rotation._180.CW = app.Rotation._270;
  app.Rotation._180.CCW = app.Rotation._90;
  app.Rotation._270.CW = app.Rotation._0;
  app.Rotation._270.CCW = app.Rotation._180;
  app.NeighborDirection = {
    T: {dir: app.Direction.T, CW: app.Direction.R, CCW: app.Direction.L},
    R: {dir: app.Direction.R, CW: app.Direction.B, CCW: app.Direction.T},
    L: {dir: app.Direction.L, CW: app.Direction.T, CCW: app.Direction.B},
    B: {dir: app.Direction.B, CW: app.Direction.L, CCW: app.Direction.R}
  };
  app.PlayableTiles = {
    two_face_adjacent_castle: {
      class: 'two-face-adjacent-castle',
      count: 5,
      faces: {T: 'FFF', R: 'FFF', B: 'CCC', L: 'CCC'},
      rotation: app.Rotation._0
    },
    one_face_castle_with_t_road: {
      class: 'one-face-castle-with-t-road', count: 3,
      faces: {T: 'FRF', R: 'FRF', B: 'FRF', L: 'CCC'},
      rotation: app.Rotation._0
    },
    one_face_opposite_separate_castles: {
      class: 'one-face-opposite-separate-castles', count: 3,
      faces: {T: 'FFF', R: 'CCC', B: 'FFF', L: 'CCC'},
      rotation: app.Rotation._0
    },
    cloister: {
      class: 'cloister ', count: 4,
      faces: {T: 'FFF', R: 'FFF', B: 'FFF', L: 'FFF'},
      rotation: app.Rotation._0
    },
    cloister_with_road: {
      class: 'cloister-with-road', count: 2,
      faces: {T: 'FFF', R: 'FRF', B: 'FFF', L: 'FFF'},
      rotation: app.Rotation._0
    },
    intersect_road: {
      class: 'intersect-road', count: 1,
      faces: {T: 'FRF', R: 'FRF', B: 'FRF', L: 'FRF'},
      rotation: app.Rotation._0
    },
    curved_road: {
      class: 'curved-road', count: 9,
      faces: {T: 'FRF', R: 'FRF', B: 'FFF', L: 'FFF'},
      rotation: app.Rotation._0
    },
    straight_road: {
      class: 'straight-road', count: 8,
      faces: {T: 'FFF', R: 'FRF', B: 'FFF', L: 'FRF'},
      rotation: app.Rotation._0
    },
    t_road: {
      class: 't-road', count: 4,
      faces: {T: 'FRF', R: 'FRF', B: 'FRF', L: 'FFF'},
      rotation: app.Rotation._0
    },
    four_face_castle: {
      class: 'four-face-castle', count: 1,
      faces: {T: 'CCC', R: 'CCC', B: 'CCC', L: 'CCC'},
      rotation: app.Rotation._0
    },
    three_face_castle: {
      class: 'three-face-castle', count: 4,
      faces: {T: 'CCC', R: 'FFF', B: 'CCC', L: 'CCC'},
      rotation: app.Rotation._0
    },
    three_face_castle_with_road: {
      class: 'three-face-castle-with-road', count: 3,
      faces: {T: 'CCC', R: 'FRF', B: 'CCC', L: 'CCC'},
      rotation: app.Rotation._0
    },
    one_face_adjacent_separate_castles: {
      class: 'one-face-adjacent-separate-castles', count: 2,
      faces: {T: 'CCC', R: 'FFF', B: 'FFF', L: 'CCC'},
      rotation: app.Rotation._0
    },
    one_face_castle: {
      class: 'one-face-castle', count: 5,
      faces: {T: 'FFF', R: 'FFF', B: 'FFF', L: 'CCC'},
      rotation: app.Rotation._0
    },
    one_face_castle_with_straight_road: {
      class: 'one-face-castle-with-straight-road',
      count: 4,
      faces: {T: 'FRF', R: 'FFF', B: 'FRF', L: 'CCC'},
      rotation: app.Rotation._0
    },
    one_face_castle_with_curved_road_1: {
      class: 'one-face-castle-with-curved-road-1', count: 3,
      faces: {T: 'FRF', R: 'FRF', B: 'FFF', L: 'CCC'},
      rotation: app.Rotation._0
    },
    one_face_castle_with_curved_road_2: {
      class: 'one-face-castle-with-curved-road-2', count: 3,
      faces: {T: 'FFF', R: 'FRF', B: 'FRF', L: 'CCC'},
      rotation: app.Rotation._0
    },
    two_face_opposite_castle: {
      class: 'two-face-opposite-castle', count: 3,
      faces: {T: 'CCC', R: 'FFF', B: 'CCC', L: 'FFF'},
      rotation: app.Rotation._0
    },
    two_face_adjacent_castle_with_curved_road: {
      class: 'two-face-adjacent-castle-with-curved-road', count: 5,
      faces: {T: 'FRF', R: 'FRF', B: 'CCC', L: 'CCC'},
      rotation: app.Rotation._0
    }
  };
  app.gameView = new app.GameView();
});