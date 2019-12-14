import * as utils from './utils/misc.mjs';
import InputManager from './utils/input.mjs';

const MOVE_STEP = 2;

class Game {
    init() {
        this.canvas = document.getElementById('game-area');
        this.ctx = this.canvas.getContext("2d");

        this.x = this.canvas.width/2;
        this.y = this.canvas.height/2;
        this.dx = 0;
        this.dy = 0;

        this.timeSinceColorChange = 0;

        InputManager.init();
    }

    update(dt) {

        // demo: just change ball color every 3 seconds
        if(this.timeSinceColorChange >= 2 * 1000000) {
            this.color = utils.generateRandomColor();
            this.timeSinceColorChange = 0;
        } else {
            this.timeSinceColorChange += Math.floor(dt);
        }

        if (InputManager.isPressedUp()) {
            this.y -= MOVE_STEP;
        }

        if (InputManager.isPressedDown()) {
            this.y += MOVE_STEP;
        }

        if (InputManager.isPressedLeft()) {
            this.x -= MOVE_STEP;
        }

        if (InputManager.isPressedRight()) {
            this.x += MOVE_STEP;
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
};

export default Game;