/* eslint-disable require-jsdoc */
let _currentID = 0;
function generateID() {
  if (_currentID >= Number.MAX_SAFE_INTEGER) {
    console.error('Attempting to generate too many objects!');
  }
  return _currentID++;
}

export default generateID;
