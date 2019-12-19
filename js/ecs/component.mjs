/* eslint-disable require-jsdoc */
import generateUID from '../utils/counter.mjs';
import {isNullOrUndefined} from '../utils/misc.mjs';

class Component {
  constructor(params) {
    const _id = generateUID();
    let _parentID = null;
    const _type = params[0] || {};
    // dirty way of deep-copying the params[1] obj
    // this is done to ensure that every instance has its own config
    const _config = JSON.parse(JSON.stringify(params[1]));

    this.getID = () => _id;
    this.getParentID = () => _parentID;
    this.getType = () => _type;
    this.getConfig = () => _config;
    this.onAttach = (uid) => {
      if (isNullOrUndefined(uid)) {
        console.error('Trying to attach component to null parent!');
        return this;
      }
      _parentID = uid;
    };

    return this;
  }
}

// make Component class 'final'
const createComponent = (params) => {
  let component = new Component(params);
  component = Object.freeze(component);
  return component;
};

export default createComponent;
