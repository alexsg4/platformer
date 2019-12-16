/* eslint-disable require-jsdoc */
import Game from './js/game.mjs';
import ResourceLoader from './js/utils/resource.mjs';
window.dbgDisplay = false;

const game = new Game();

let isGameRunning = false;
const startGame = function() {
  console.log('Game is loaded');

  game.init();
  main(window.performance.now());
};

ResourceLoader.init(startGame);

function main(tFrame) {
  if (!isGameRunning) {
    console.log('Game is running!');
    isGameRunning = true;
  }
  game.stopMain = window.requestAnimationFrame( main );

  const tNow = window.performance.now();
  game.update(tNow - tFrame);
  game.render();
}
