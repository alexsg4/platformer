/* eslint-disable require-jsdoc */
import Swal from '../../node_modules/sweetalert2/src/sweetalert2.js';

const createTextInput = (type, name, labelValue, validator, value) => {
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

  if (validator) {
    if (validator.regex) {
      input.pattern = validator.regex;
    }
    input.required = validator.required;

    input.addEventListener('input', () => {
      input.setCustomValidity('');
      if (input.checkValidity()) {
        input.setCustomValidity('');
        removeClass(input, validator.errClass);
        Swal.close();
      } else {
        input.setCustomValidity(validator.errMsg);
      }
    });

    input.addEventListener('invalid', () => {
      addClass(input, validator.errClass);
      Swal.fire({
        title: 'warning',
        text: validator.errMsg,
        icon: 'warning',
        toast: true,
        position: 'top-end',
      });
    });
  }

  para.appendChild(input);

  return para;
};

const createSelectInput = (name, labelValue, options) => {
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
};

const createRCInput = (type, name, labelValue, value, text) => {
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
};

const createRangeInput = (name, labelValue, value, min, max, step) => {
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
};

const addClass = (DOMElement, classToAdd) => {
  if (DOMElement) {
    if (!DOMElement.className.includes(classToAdd)) {
      DOMElement.className = DOMElement.className + ' ' + classToAdd;
    }
  }
};

const removeClass = (DOMElement, classToRemove) => {
  if (DOMElement) {
    DOMElement.className = DOMElement.className.replace(classToRemove, ' ');
  }
};

const toggleClass = (DOMElement, classToToggle) => {
  if (DOMElement) {
    if (DOMElement.className.includes(classToToggle)) {
      removeClass(DOMElement, classToToggle);
    } else {
      addClass(DOMElement, classToToggle);
    }
  }
};

export default {
  createTextInput,
  createSelectInput,
  createRCInput,
  createRangeInput,
  addClass,
  removeClass,
  toggleClass,
};
