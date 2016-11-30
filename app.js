var app = app || {};
$(function () {
  'use strict';

  app.game = new app.Game();
  app.gameView = new app.GameView({model: app.game});
});
