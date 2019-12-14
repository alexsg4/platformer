class InputManager {

    constructor() {
        if (!!InputManager.instance) {
            return InputManager.instance;
        }

        InputManager.instance = this;

        return this;
    }

    static init() {
        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;

        // Set up `onkeydown` event handler.
        document.onkeydown = ev => {
            if (ev.key === 'd') {
                this.right = true;
            }
            if (ev.key === 'a') {
                this.left = true;
            }
            if (ev.key === 'w') {
                this.up = true;
            }
            if (ev.key === 's') {
                this.down = true;
            }
        };
        // Set up `onkeyup` event handler.
        document.onkeyup = ev => {
            if (ev.key === 'd') {
                this.right = false;
            }
            if (ev.key === 'a') {
                this.left = false;
            }
            if (ev.key === 'w') {
                this.up = false;
            }
            if (ev.key === 's') {
                this.down = false;
            }
        };
    }

    // Define getters for each key
    static isPressedUp() {
        return this.up;
    }

    static isPressedDown() {
        return this.down;
    }

    static isPressedLeft() {
        return this.left;
    }

    static isPressedRight() {
        return this.right;
    }
}

export default InputManager;