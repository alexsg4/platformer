import Game from "./game.mjs";

document.dbgDisplay = false;

const game = new Game();
game.init();

;(function () {
    function main(dt) {
        game.stopMain = window.requestAnimationFrame( main );
      
        game.update(dt);
        game.render();
    }
    main(0);
})();
