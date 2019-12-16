/* eslint-disable require-jsdoc */

let _up = false;
let _down = false;
let _left = false;
let _right = false;

function init() {
  // Set up `onkeydown` event handler.
  document.onkeydown = (ev) => {
    if (ev.key === 'd') {
      _right = true;
    }
    if (ev.key === 'a') {
      _left = true;
    }
    if (ev.key === 'w') {
      _up = true;
    }
    if (ev.key === 's') {
      _down = true;
    }
  };

  // Set up `onkeyup` event handler.
  document.onkeyup = (ev) => {
    if (ev.key === 'd') {
      _right = false;
    }
    if (ev.key === 'a') {
      _left = false;
    }
    if (ev.key === 'w') {
      _up = false;
    }
    if (ev.key === 's') {
      _down = false;
    }
  };
}

// Define getters for each key
function isPressedUp() {
  return _up;
}

function isPressedDown() {
  return _down;
}

function isPressedLeft() {
  return _left;
}

function isPressedRight() {
  return _right;
}

export default {
  init, isPressedUp, isPressedDown, isPressedLeft, isPressedRight};
