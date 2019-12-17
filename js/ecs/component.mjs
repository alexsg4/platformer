/* eslint-disable require-jsdoc */
import generateUID from '../utils/counter.mjs';
import {isNullOrUndefined} from '../utils/misc.mjs';

class Component {
  constructor(params) {
    this.id = generateUID();
    this.parentID = null;
    this.type = params[0] || {};
    this.config = params[1] || {};
  }

  onAttach(uid) {
    if (isNullOrUndefined(uid)) {
      console.error('Trying to attach component to null parent!');
      return;
    }
    this.parentID = uid;
  }
}

const createComponent = (params) => {
  const component = new Component(params);
  return component;
};

export default createComponent;
