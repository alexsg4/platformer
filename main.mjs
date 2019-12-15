/* eslint-disable require-jsdoc */
import Game from './js/game.mjs';

global.dbgDisplay = false;

const game = new Game();
game.init();

;(function() {
  function main(dt) {
    game.stopMain = window.requestAnimationFrame( main );

    game.update(dt);
    game.render();
  }
  main(0);
})();
