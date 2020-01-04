/* eslint-disable require-jsdoc */
import Game from './js/game.mjs';
import ResourceLoader from './js/utils/resource.mjs';
import InputManager from './js/utils/input.mjs';
import Swal from './node_modules/sweetalert2/src/sweetalert2.js';
import {isNullOrUndefined} from './js/utils/misc.mjs';

window.dbgDisplay = false;

let _isGameRunning = false;
let _stopMain = undefined;

function createTextInput(type, name, labelValue, value) {
  const para = document.createElement('p');

  const inputID = 'input-' + name;
  if (labelValue) {
    const label = document.createElement('label');
    label.innerHTML = labelValue + ': ';
    label.for = inputID;
    para.appendChild(label);
  }
  const input = document.createElement('input');
  input.type = type;
  input.id = inputID;
  input.value = value || '';

  para.appendChild(input);

  return para;
}

function createSelectInput(name, labelValue, options) {
  const para = document.createElement('p');

  const inputID = 'input-' + name;
  if (labelValue) {
    const label = document.createElement('label');
    label.innerHTML = labelValue + ': ';
    label.for = inputID;
    para.appendChild(label);
  }
  const input = document.createElement('select');
  input.id = inputID;

  for (let optionValue of options) {
    const option = document.createElement('option');
    optionValue = optionValue;
    option.innerHTML = optionValue;
    option.value = optionValue.toLowerCase();

    input.append(option);
  }

  para.appendChild(input);
  return para;
}

function createRCInput(type, name, labelValue, value, text) {
  const para = document.createElement('p');

  const inputID = 'input-' + name;
  if (labelValue) {
    const label = document.createElement('label');
    label.innerHTML = labelValue + ': ';
    label.for = inputID;
    para.appendChild(label);
  }

  const input = document.createElement('input');
  input.type = type;
  input.id = inputID;
  input.value = value || '';

  para.appendChild(input);
  para.appendChild(document.createTextNode(text));
  return para;
}

function createRangeInput(name, labelValue, value, min, max, step) {
  const para = document.createElement('p');

  const inputID = 'input-' + name;
  if (labelValue) {
    const label = document.createElement('label');
    label.innerHTML = labelValue + ': ';
    label.for = inputID;
    para.appendChild(label);
  }

  const input = document.createElement('input');
  input.type = 'range';
  input.id = inputID;
  input.value = value;
  input.min = min;
  input.max = max;
  input.step = step;

  para.appendChild(input);
  return para;
}

function initForm() {
  const mainArea = document.getElementsByTagName('main')[0];
  const gameArea = document.getElementById('game-area');
  if (!isNullOrUndefined(gameArea)) {
    gameArea.style.display = 'none';
  }

  const formContainer = document.createElement('div');
  formContainer.id = 'form-container';

  const formTitle = document.createElement('h2');
  formTitle.id = 'form-title';
  formTitle.innerHTML = 'Register';
  const form = document.createElement('form');
  form.id = 'register-form';
  form.addEventListener('submit', (event) => {
    initGame();
    event.preventDefault();
  });

  const nameInput = createTextInput('text', 'frName', 'Name');
  const pwInput = createTextInput('password', 'frPassword', 'Password');
  const emailInput = createTextInput('email', 'frEmail', 'Email');
  const selectInput = createSelectInput(
      'frSelect',
      'Difficulty',
      ['easy', 'normal', 'hard'],
  );

  const radioButtonA = createRCInput('radio', 'radio-wrld-gen', '', 'generatedWorld', 'Generate world');
  const radioButtonB = createRCInput('radio', 'radio-wrld-test', '', 'testWorld', 'testWorld world');
  const checkButtonA = createRCInput('checkbox', 'dbg-text', '', 'dbg-text', 'Debug text');
  const checkButtonB = createRCInput('checkbox', 'dbg-overlay', '', 'dbg-overlay', 'Debug overlay');
  
  const rangeInput = createRangeInput('range', 'WorldSize', '10', '8', '48', '1');

  const submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = 'startGame';

  form.appendChild(nameInput);
  form.appendChild(pwInput);
  form.appendChild(emailInput);
  form.appendChild(selectInput);
  form.appendChild(document.createTextNode('Debug config: '));
  form.appendChild(checkButtonA);
  form.appendChild(checkButtonB);
  form.appendChild(document.createTextNode('World config: '));
  form.appendChild(radioButtonA);
  form.appendChild(radioButtonB);
  form.appendChild(rangeInput);
  form.appendChild(submitInput);

  formContainer.appendChild(formTitle);
  formContainer.appendChild(form);
  mainArea.appendChild(formContainer);
}

function initGame() {
  const mainArea = document.getElementsByTagName('main')[0];
  let gameArea = document.getElementById('game-area');

  if (isNullOrUndefined(gameArea)) {
    gameArea = document.createElement('canvas');
    gameArea.setAttribute('id', 'game-area');
    gameArea.setAttribute('width', '800');
    gameArea.setAttribute('height', '600');

    mainArea.appendChild(gameArea);
  } else {
    gameArea.style.display = 'block';
  }

  const form = document.getElementById('form-container');
  if (!isNullOrUndefined(form)) {
    form.style.display = 'none';
  }

  startGame();
}

function startGame() {
  console.log('Game is loaded');

  InputManager.init();
  Game.init();
  main(window.performance.now());
};

function stopGame() {
  window.cancelAnimationFrame( _stopMain );
  Game.shutdown();
  _isGameRunning = false;

  // TODO get score from the game
  // Create a form for asking user to submit the high score
  // Create the UI for resetting the game and wire in that logic
}

ResourceLoader.init(initForm);

function main(tFrame) {
  if (!_isGameRunning) {
    console.log('Game is running!');
    _isGameRunning = true;
  }
  _stopMain = window.requestAnimationFrame( main );

  const tNow = window.performance.now();
  Game.update(tNow - tFrame);
  Game.render();

  if (Game.needsToStop) {
    stopGame();
  }
}
