/* eslint-disable require-jsdoc */
import Game from './js/game.mjs';
import ResourceLoader from './js/utils/resource.mjs';
import InputManager from './js/utils/input.mjs';

window.dbgDisplay = false;

let _isGameRunning = false;
let _stopMain = undefined;
const startGame = function() {
  console.log('Game is loaded');

  InputManager.init();
  Game.init();
  main(window.performance.now());
};

ResourceLoader.init(startGame);

function main(tFrame) {
  if (!_isGameRunning) {
    console.log('Game is running!');
    _isGameRunning = true;
  }
  _stopMain = window.requestAnimationFrame( main );

  const tNow = window.performance.now();
  Game.update(tNow - tFrame);
  Game.render();
}
