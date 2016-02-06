var app = app || {};
$(function () {
  'use strict';
  app.TILE_SEQ_NUM = 10;
  app.SEGMENT_SEQ_NUM = 1;
  app.PLAYABLE_TILE_EGMENT_SEQ_NUM = 1;
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
    _0: {id: 0},
    _90: {id: 90},
    _180: {id: 180},
    _270: {id: 270}
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
    T: {dir: app.Direction.T, CW: 'R', CCW: 'L'},
    R: {dir: app.Direction.R, CW: 'B', CCW: 'T'},
    L: {dir: app.Direction.L, CW: 'T', CCW: 'B'},
    B: {dir: app.Direction.B, CW: 'L', CCW: 'R'}
  };
  app.PlayableTiles = {
    two_face_adjacent_castle: {
      class: 'two-face-adjacent-castle',
      count: 5,
      faces: {
        T: {face: 'FFF', segments: [0]},
        R: {face: 'FFF', segments: [0]},
        B: {face: 'CCC', segments: [1]},
        L: {face: 'CCC', segments: [1]}
      },
      segments: [{type: 'F'}, {type: 'C'}]
    },
    one_face_castle_with_t_road: {
      class: 'one-face-castle-with-t-road', count: 3,
      faces: {
        T: {face: 'FRF', segments: [0, 1, 2]},
        R: {face: 'FRF', segments: [2, 3, 4]},
        B: {face: 'FRF', segments: [4, 5, 0]},
        L: {face: 'CCC', segments: [6]}
      },
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'C'}]
    },
    one_face_opposite_separate_castles: {
      class: 'one-face-opposite-separate-castles', count: 3,
      faces: {
        T: {face: 'FFF', segments: [0]},
        R: {face: 'CCC', segments: [1]},
        B: {face: 'FFF', segments: [0]},
        L: {face: 'CCC', segments: [2]}
      },
      segments: [{type: 'F'}, {type: 'C'}, {type: 'C'}]
    },
    cloister: {
      class: 'cloister ', count: 4,
      faces: {
        T: {face: 'FFF', segments: [0]},
        R: {face: 'FFF', segments: [0]},
        B: {face: 'FFF', segments: [0]},
        L: {face: 'FFF', segments: [0]}
      },
      segments: [{type: 'F'}]
    },
    cloister_with_road: {
      class: 'cloister-with-road', count: 2,
      faces: {
        T: {face: 'FFF', segments: [0]},
        R: {face: 'FRF', segments: [0, 1, 0]},
        B: {face: 'FFF', segments: [0]},
        L: {face: 'FFF', segments: [0]}
      },
      segments: [{type: 'F'}, {type: 'R'}]
    },
    intersect_road: {
      class: 'intersect-road', count: 1,
      faces: {
        T: {face: 'FRF', segments: [0, 1, 2]},
        R: {face: 'FRF', segments: [2, 3, 4]},
        B: {face: 'FRF', segments: [4, 5, 6]},
        L: {face: 'FRF', segments: [6, 7, 0]}
      },
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}]
    },
    curved_road: {
      class: 'curved-road', count: 9,
      faces: {
        T: {face: 'FRF', segments: [0, 1, 2]},
        R: {face: 'FRF', segments: [2, 1, 0]},
        B: {face: 'FFF', segments: [0]},
        L: {face: 'FFF', segments: [0]}
      },
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}]
    },
    straight_road: {
      class: 'straight-road', count: 8,
      faces: {
        T: {face: 'FFF', segments: [0]},
        R: {face: 'FRF', segments: [0, 1, 2]},
        B: {face: 'FFF', segments: [2]},
        L: {face: 'FRF', segments: [0, 1, 2]}
      },
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}]
    },
    t_road: {
      class: 't-road', count: 4,
      faces: {
        T: {face: 'FRF', segments: [0, 1, 2]},
        R: {face: 'FRF', segments: [2, 3, 4]},
        B: {face: 'FRF', segments: [4, 5, 0]},
        L: {face: 'FFF', segments: [0]}
      },
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'R'}]
    },
    four_face_castle: {
      class: 'four-face-castle', count: 1,
      faces: {
        T: {face: 'CCC', segments: [0]},
        R: {face: 'CCC', segments: [0]},
        B: {face: 'CCC', segments: [0]},
        L: {face: 'CCC', segments: [0]}
      },
      segments: [{type: 'C'}]
    },
    three_face_castle: {
      class: 'three-face-castle', count: 4,
      faces: {
        T: {face: 'CCC', segments: [0]},
        R: {face: 'FFF', segments: [1]},
        B: {face: 'CCC', segments: [0]},
        L: {face: 'CCC', segments: [0]}
      },
      segments: [{type: 'C'}, {type: 'F'}]
    },
    three_face_castle_with_road: {
      class: 'three-face-castle-with-road', count: 3,
      faces: {
        T: {face: 'CCC', segments: [0]},
        R: {face: 'FRF', segments: [1, 2, 3]},
        B: {face: 'CCC', segments: [0]},
        L: {face: 'CCC', segments: [0]}
      },
      segments: [{type: 'C'}, {type: 'F'}, {type: 'R'}, {type: 'F'}]
    },
    one_face_adjacent_separate_castles: {
      class: 'one-face-adjacent-separate-castles', count: 2,
      faces: {
        T: {face: 'CCC', segments: [0]},
        R: {face: 'FFF', segments: [1]},
        B: {face: 'FFF', segments: [1]},
        L: {face: 'CCC', segments: [2]}
      },
      segments: [{type: 'C'}, {type: 'F'}, {type: 'C'}]
    },
    one_face_castle: {
      class: 'one-face-castle', count: 5,
      faces: {
        T: {face: 'FFF', segments: [0]},
        R: {face: 'FFF', segments: [0]},
        B: {face: 'FFF', segments: [0]},
        L: {face: 'CCC', segments: [1]}
      },
      segments: [{type: 'F'}, {type: 'C'}]
    },
    one_face_castle_with_straight_road: {
      class: 'one-face-castle-with-straight-road',
      count: 4,
      faces: {
        T: {face: 'FRF', segments: [0, 1, 2]},
        R: {face: 'FFF', segments: [2]},
        B: {face: 'FRF', segments: [0, 1, 2]},
        L: {face: 'CCC', segments: [3]}
      },
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'C'}]
    },
    one_face_castle_with_curved_road_1: {
      class: 'one-face-castle-with-curved-road-1', count: 3,
      faces: {
        T: {face: 'FRF', segments: [0, 1, 2]},
        R: {face: 'FRF', segments: [2, 1, 0]},
        B: {face: 'FFF', segments: [0]},
        L: {face: 'CCC', segments: [3]}
      },
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'C'}]
    },
    one_face_castle_with_curved_road_2: {
      class: 'one-face-castle-with-curved-road-2', count: 3,
      faces: {
        T: {face: 'FFF', segments: [0]},
        R: {face: 'FRF', segments: [0, 1, 2]},
        B: {face: 'FRF', segments: [0, 1, 2]},
        L: {face: 'CCC', segments: [3]}
      },
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'C'}]
    },
    two_face_opposite_castle: {
      class: 'two-face-opposite-castle', count: 3,
      faces: {
        T: {face: 'CCC', segments: [0]},
        R: {face: 'FFF', segments: [1]},
        B: {face: 'CCC', segments: [0]},
        L: {face: 'FFF', segments: [2]}
      },
      segments: [{type: 'C'}, {type: 'F'}, {type: 'F'}]
    },
    two_face_adjacent_castle_with_curved_road: {
      class: 'two-face-adjacent-castle-with-curved-road', count: 5,
      faces: {
        T: {face: 'FRF', segments: [0, 1, 2]},
        R: {face: 'FRF', segments: [2, 1, 0]},
        B: {face: 'CCC', segments: [3]},
        L: {face: 'CCC', segments: [3]}
      },
      segments: [{type: 'F'}, {type: 'R'}, {type: 'F'}, {type: 'C'}]
    }
  };
});