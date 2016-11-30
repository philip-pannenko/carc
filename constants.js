var app = app || {};
$(function () {
  'use strict';
  app.DEBUG_SEGMENT = true;
  app.DEBUG_TILE = false;

  app.TILE_SEQ_NUM = 10;
  app.SEGMENT_SEQ_NUM = 1;
  app.PLAYABLE_TILE_SEGMENT_SEQ_NUM = 1;
  Array.prototype.clear = function () {
    this.splice(0, this.length);
  };
  app.TileState = {
    unoccupied: 'Unoccupied',
    occupied: 'Occupied',
    undefined: null
  };
  app.SegmentType = {
    F: {type: 'Farm'},
    R: {type: 'Road'},
    Ca: {type: 'Castle'},
    Cl: {type: 'Cloisture'}
  };
  app.GameState = {
    tilePlacement: 'tile',
    pawnPlacement: 'pawn',
    endGame: 'end'
  };

  app.Direction = {
    TL: {
      id: 1,
      name: 'TL',
      fullName: 'top-left',
      relativeX: -1,
      relativeY: -1,
      x: 0,
      y: 0,
      oppositeDirName: 'BR',
      CW: 'TR',
      CCW: 'BL',
      getElId: function (el, x) {
        return el.parentNode.previousElementSibling.children[x - 1].id
      }
    },
    T: {
      id: 2,
      name: 'T',
      fullName: 'top',
      relativeX: 0,
      relativeY: -1,
      x: 1,
      y: 0,
      oppositeDirName: 'B',
      CW: 'R',
      CCW: 'L',
      getElId: function (el, x) {
        return el.parentNode.previousElementSibling.children[x].id
      }
    },
    TR: {
      id: 3,
      name: 'TR',
      fullName: 'top-right',
      relativeX: 1,
      relativeY: -1,
      x: 2,
      y: 0,
      oppositeDirName: 'BL',
      CW: 'BR',
      CCW: 'TL',
      getElId: function (el, x) {
        return el.parentNode.previousElementSibling.children[x + 1].id
      }
    },
    L: {
      id: 4,
      name: 'L',
      fullName: 'left',
      relativeX: -1,
      relativeY: 0,
      x: 0,
      y: 1,
      oppositeDirName: 'R',
      CW: 'T',
      CCW: 'B',
      getElId: function (el) {
        return el.previousElementSibling.id
      }
    },
    C: {
      id: 5,
      name: 'C',
      fullName: 'center',
      relativeX: 0,
      relativeY: 0,
      x: 1,
      y: 1,
      oppositeDirName: 'C',
      CW: 'C',
      CCW: 'C',
      getElId: function (el) {
        return el.id
      }
    },
    R: {
      id: 6,
      name: 'R',
      fullName: 'right',
      relativeX: 1,
      relativeY: 0,
      x: 2,
      y: 1,
      oppositeDirName: 'L',
      CW: 'B',
      CCW: 'T',
      getElId: function (el) {
        return el.nextElementSibling.id
      }
    },
    BL: {
      id: 7,
      name: 'BL',
      fullName: 'bottom-left',
      relativeX: -1,
      relativeY: 1,
      x: 0,
      y: 2,
      oppositeDirName: 'TR',
      CW: 'TL',
      CCW: 'BR',
      getElId: function (el, x) {
        return el.parentNode.nextElementSibling.children[x - 1].id
      }
    },
    B: {
      id: 8,
      name: 'B',
      fullName: 'bottom',
      relativeX: 0,
      relativeY: 1,
      x: 1,
      y: 2,
      oppositeDirName: 'T',
      CW: 'L',
      CCW: 'R',
      getElId: function (el, x) {
        return el.parentNode.nextElementSibling.children[x].id
      }
    },
    BR: {
      id: 9,
      name: 'BR',
      fullName: 'bottom-right',
      relativeX: 1,
      relativeY: 1,
      x: 2,
      y: 2,
      oppositeDirName: 'TL',
      CW: 'BL',
      CCW: 'TR',
      getElId: function (el, x) {
        return el.parentNode.nextElementSibling.children[x + 1].id;
      }
    }
  };

  app.Rotation = {
    _0: {name: '_0', CW: '_90', CCW: '_270'},
    _90: {name: '_90', CW: '_180', CCW: '_0'},
    _180: {name: '_180', CW: '_270', CCW: '_90'},
    _270: {name: '_270', CW: '_0', CCW: '_180'}
  };

  app.NeighborDirection = {
    T: app.Direction.T,
    R: app.Direction.R,
    L: app.Direction.L,
    B: app.Direction.B
  };

  app.DirectionFaces = {
    T: {
      opposite: 'B',
      faces: [app.Direction.TL, app.Direction.T, app.Direction.TR]
    },
    R: {
      opposite: 'L',
      faces: [app.Direction.TR, app.Direction.R, app.Direction.BR]
    },
    L: {
      opposite: 'R',
      faces: [app.Direction.TL, app.Direction.L, app.Direction.BL]
    },
    B: {
      opposite: 'T',
      faces: [app.Direction.BL, app.Direction.B, app.Direction.BR]
    }
  };

  app.PlayableTiles = {
    two_face_adjacent_castle: {
      class: 'two-face-adjacent-castle',
      count: 5,
      segments: [{type: 'F'}, {type: 'C'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 0, TR: 0,
        L: 1, C: -1, R: 0,
        BL: 1, B: 1, BR: 0
      }
    },
    one_face_castle_with_t_road: {
      class: 'one-face-castle-with-t-road',
      count: 3,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'C'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 1, TR: 2,
        L: 6, C: -1, R: 3,
        BL: 0, B: 5, BR: 4
      }

    },
    one_face_opposite_separate_castles: {
      class: 'one-face-opposite-separate-castles',
      count: 3,
      segments: [{type: 'F'}, {type: 'C'}, {type: 'C'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 0, TR: 0,
        L: 1, C: 0, R: 2,
        BL: 0, B: 0, BR: 0
      }
    },
    cloister: {
      class: 'cloister ',
      count: 4,
      segments: [{type: 'F'}, {type: 'Cl'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 0, TR: 0,
        L: 0, C: 1, R: 0,
        BL: 0, B: 0, BR: 0
      }

    },
    cloister_with_road: {
      class: 'cloister-with-road',
      count: 2,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'Cl'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 0, TR: 0,
        L: 0, C: 2, R: 1,
        BL: 0, B: 0, BR: 0
      }
    },
    intersect_road: {
      class: 'intersect-road',
      count: 1,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 1, TR: 2,
        L: 3, C: -1, R: 4,
        BL: 5, B: 6, BR: 7
      }

    },
    curved_road: {
      class: 'curved-road',
      count: 9,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 1, TR: 2,
        L: 0, C: -1, R: 1,
        BL: 0, B: 0, BR: 0
      }
    },
    straight_road: {
      class: 'straight-road',
      count: 8,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 1, TR: 0,
        L: 0, C: 1, R: 0,
        BL: 0, B: 1, BR: 0
      }
    },
    t_road: {
      class: 't-road',
      count: 4,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 1, TR: 2,
        L: 0, C: -1, R: 3,
        BL: 0, B: 5, BR: 4
      }
    },
    four_face_castle: {
      class: 'four-face-castle',
      count: 1,
      segments: [{type: 'C'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 0, TR: 0,
        L: 0, C: 0, R: 0,
        BL: 0, B: 0, BR: 0
      }
    },
    three_face_castle: {
      class: 'three-face-castle',
      count: 4,
      segments: [{type: 'C'}, {type: 'F'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 0, TR: 0,
        L: 0, C: 0, R: 1,
        BL: 0, B: 0, BR: 0
      }
    },
    three_face_castle_with_road: {
      class: 'three-face-castle-with-road',
      count: 3,
      segments: [{type: 'C'}, {type: 'F'}, {type: 'R'}, {type: 'F'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 0, TR: 1,
        L: 0, C: 0, R: 2,
        BL: 0, B: 0, BR: 3
      }
    },
    one_face_adjacent_separate_castles: {
      class: 'one-face-adjacent-separate-castles',
      count: 2,
      segments: [{type: 'C'}, {type: 'F'}, {type: 'C'}],
      segmentIndexByCoordinate: {
        TL: -1, T: 0, TR: 0,
        L: 0, C: 1, R: 1,
        BL: 0, B: 1, BR: 1
      }
    },
    one_face_castle: {
      class: 'one-face-castle',
      count: 5,
      segments: [{type: 'F'}, {type: 'C'}],
      segmentIndexByCoordinate: {
        TL: -1, T: 0, TR: 0,
        L: 1, C: 0, R: 0,
        BL: 0, B: 0, BR: 0
      }
    },
    one_face_castle_with_straight_road: {
      class: 'one-face-castle-with-straight-road',
      count: 4,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'C'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 1, TR: 2,
        L: 3, C: 1, R: 2,
        BL: 0, B: 1, BR: 2
      }
    },
    one_face_castle_with_curved_road_1: {
      class: 'one-face-castle-with-curved-road-1',
      count: 3,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'C'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 1, TR: 2,
        L: 3, C: -1, R: 1,
        BL: 0, B: 0, BR: 0
      }
    },
    one_face_castle_with_curved_road_2: {
      class: 'one-face-castle-with-curved-road-2',
      count: 3,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'C'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 0, TR: 0,
        L: 3, C: -1, R: 1,
        BL: 0, B: 1, BR: 2
      }
    },
    two_face_opposite_castle: {
      class: 'two-face-opposite-castle',
      count: 3,
      segments: [{type: 'C'}, {type: 'F'}, {type: 'F'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 0, TR: 0,
        L: 2, C: 0, R: 1,
        BL: 0, B: 0, BR: 0
      }
    },
    two_face_adjacent_castle_with_curved_road: {
      class: 'two-face-adjacent-castle-with-curved-road',
      count: 5,
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'C'}],
      segmentIndexByCoordinate: {
        TL: 0, T: 1, TR: 2,
        L: 3, C: -1, R: 1,
        BL: 3, B: 3, BR: 0
      }
    }
  };
});
