/* eslint-disable require-jsdoc */
let _currentID = 0;
function generateUID() {
  // TODO generate string UIDs
  if (_currentID >= Number.MAX_SAFE_INTEGER) {
    console.error('UID limit reached!');
  }
  return _currentID++;
}

export default generateUID;
