/* eslint-disable require-jsdoc */

const _inputStates = new Map();

class InputState {
  constructor(isPressed = true) {
    this.pressed = isPressed;
    this.active = false;
    return this;
  }

  onKeyDown() {
    if (this.pressed) {
      this.active = true;
    } else {
      this.pressed = true;
    }
  }

  onKeyUp() {
    this.pressed = false;
    this.active = false;
  }
};

function init(inputs) {
  if (Array.isArray(inputs)) {
    for (const input of inputs) {
      _inputStates.set(input[0], new InputState(false));
      _inputStates.set(input[1], new InputState(false));
    }
  }

  // Set up `onkeydown` event handler
  document.onkeydown = (ev) => {
    let inputState = undefined;
    let useKeyCode = false;
    if (ev.key === undefined) {
      inputState = _inputStates.get(ev.keyCode);
      useKeyCode = true;
    } else {
      inputState = _inputStates.get(ev.key);
    }
    if (inputState === undefined) {
      if (useKeyCode) {
        _inputStates.set(ev.keyCode, new InputState());
      } else {
        _inputStates.set(ev.key, new InputState());
      }
    } else {
      inputState.onKeyDown();
    }
  };

  // Set up `onkeyup` event handler
  document.onkeyup = (ev) => {
    let inputState = undefined;
    let useKeyCode = false;
    if (ev.key === undefined) {
      inputState = _inputStates.get(ev.keyCode);
      useKeyCode = true;
    } else {
      inputState = _inputStates.get(ev.key);
    }
    if (inputState === undefined) {
      if (useKeyCode) {
        _inputStates.set(ev.keyCode, new InputState());
      } else {
        _inputStates.set(ev.key, new InputState());
      }
    } else {
      inputState.onKeyUp();
    }
  };
}

function checkInputState(input) {
  return _inputStates.get(input);
}

export default {init, checkInputState};
