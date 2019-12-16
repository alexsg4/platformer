/* eslint-disable require-jsdoc */
import generateID from '../utils/counter.mjs';

class Unique {
  constructor() {
    this.id = generateID();
    return this;
  }
};

export default Unique;
