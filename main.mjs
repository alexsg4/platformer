/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import Game from './js/game.mjs';
import ResourceLoader from './js/utils/resource.mjs';
import InputManager from './js/utils/input.mjs';
import {isNullOrUndefined} from './js/utils/misc.mjs';
import DOMHelpers from './js/utils/domHelpers.mjs';
import Swal from './node_modules/sweetalert2/src/sweetalert2.js';

let _isGameRunning = false;
let _stopMain = undefined;

function createControlsDisplay() {
  const mainArea = document.getElementsByTagName('main')[0];
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'controls-container';

  const controlsList = document.createElement('p');
  controlsList.id = 'controls-list';
  controlsList.textContent = 'Move:\t\tWASD\nAttack:\t\t: Space';
  const controlsTile = document.createElement('h2');
  controlsTile.textContent = 'Controls';

  controlsContainer.appendChild(controlsTile);
  controlsContainer.appendChild(controlsList);

  mainArea.appendChild(controlsContainer);
}

function initControlsDisplay() {
  const controls = document.getElementById('controls-container');
  if (isNullOrUndefined(controls)) {
    createControlsDisplay();
  } else {
    controls.style.display = 'block';
  }

  const form = document.getElementById('form-container');
  if (!isNullOrUndefined(form)) {
    form.style.display = 'none';
  }

  window.setTimeout(
      () => {
        const controls = document.getElementById('controls-container');
        controls.style.display = 'none';
        initGame();
      },
      2000,
  );
}

function createForm() {
  const mainArea = document.getElementsByTagName('main')[0];
  const formContainer = document.createElement('div');
  formContainer.id = 'form-container';

  const formTitle = document.createElement('h2');
  formTitle.id = 'form-title';
  formTitle.innerHTML = 'Config';
  const form = document.createElement('form');
  form.id = 'register-form';
  form.addEventListener('submit', (event) => {
    initControlsDisplay();
    event.preventDefault();
  });

  const nameInput = DOMHelpers.createTextInput(
      'text', 'frName', 'Name',
      {
        regex: '^[a-zA-Z]{1}[0-9a-zA-Z]{2,15}$',
        required: true,
        errClass: 'errField',
        errMsg: 'Name must be between 3 and 16 characters and start with a letter',
      },
  );

  const pwInput = DOMHelpers.createTextInput(
      'password', 'frPassword', 'Password',
      {
        regex: '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,64}$',
        required: true,
        errClass: 'errField',
        errMsg: 'Password must be between 8-64 characters long and contain at least one letter, one number and one special character: @$!%*#?&',
      },
  );
  const emailInput = DOMHelpers.createTextInput(
      'email', 'frEmail', 'Email',
      {
        // regex: '[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*',
        required: true,
        errClass: 'errField',
        errMsg: 'Email address is invalid',
      },
  );

  const selDifficulty = DOMHelpers.createSelectInput(
      'frSelect',
      'Difficulty',
      ['easy', 'normal', 'hard'],
  );

  const rbGenWorld = DOMHelpers.createRCInput('radio', 'radio-wrld-gen', '', 'generatedWorld', 'Generate world (BETA)');
  const rbTestWorld = DOMHelpers.createRCInput('radio', 'radio-wrld-test', '', 'testWorld', 'Test world');

  const cbDbgText = DOMHelpers.createRCInput('checkbox', 'dbg-text', '', 'dbg-text', 'Debug text');
  const cbDbgOverlay = DOMHelpers.createRCInput('checkbox', 'dbg-overlay', '', 'dbg-overlay', 'Debug overlay');

  const rgWorldSize = DOMHelpers.createRangeInput('range', 'WorldSize', '36', '16', '64', '4');

  const submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = 'Start Game';

  form.appendChild(nameInput);
  form.appendChild(pwInput);
  form.appendChild(emailInput);

  selDifficulty.addEventListener('input', () => {
    window.GameParams.Difficulty = selDifficulty.children[1].value;
  });
  form.appendChild(selDifficulty);

  form.appendChild(document.createElement('br'));
  form.appendChild(document.createTextNode('Debug config: '));
  cbDbgText.addEventListener('input', () => {
    window.GameParams.DebugText = cbDbgText.children[0].checked;
  });
  cbDbgOverlay.addEventListener('input', () => {
    window.GameParams.DebugOverlay = cbDbgOverlay.children[0].checked;
  });
  form.appendChild(cbDbgText);
  form.appendChild(cbDbgOverlay);

  form.appendChild(document.createTextNode('World config: '));
  rbGenWorld.children[0].checked = false;
  rbTestWorld.children[0].checked = true;
  rbGenWorld.addEventListener('input', (event) => {
    rbTestWorld.children[0].checked = false;
    rgWorldSize.children[1].disabled = false;
  });
  rbTestWorld.addEventListener('input', (event) => {
    rbGenWorld.children[0].checked = false;
    rgWorldSize.children[1].disabled = true;
    rgWorldSize.children[1].value = 0;
  });
  form.appendChild(rbGenWorld);
  form.appendChild(rbTestWorld);
  rgWorldSize.children[1].disabled = true;
  rgWorldSize.children[1].value = 0;
  rgWorldSize.addEventListener('input', () => {
    window.GameParams.WorldSize = parseInt(rgWorldSize.children[1].value);
    // TODO display on screen
    console.log('World size ', rgWorldSize.children[1].value);
  });
  form.appendChild(rgWorldSize);
  form.appendChild(submitInput);

  formContainer.appendChild(formTitle);
  formContainer.appendChild(form);
  mainArea.appendChild(formContainer);
}

function initForm() {
  const gameArea = document.getElementById('game-area');
  if (!isNullOrUndefined(gameArea)) {
    gameArea.style.display = 'none';
  }

  window.GameParams = {
    'DebugOverlay': false,
    'DebugText': false,
    'WorldSize': false,
    'Difficulty': 'easy',
  };

  const formArea = document.getElementById('form-container');
  if (isNullOrUndefined(formArea)) {
    createForm();
  } else {
    formArea.style.display = 'block';
  }
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
  Swal.fire({
    title: 'Game over',
    icon: 'question',
    text: 'Play again?',
    onClose: initForm,
  });
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

  if (Game.needsToStop()) {
    stopGame();
  }
}
