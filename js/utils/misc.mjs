const generateRandomColor = function() {
  const minColor = 0x555555;
  const maxColor = 0xdddddd;
  const generatedColor = '#' + Math.floor(
      minColor + Math.random() * maxColor).toString(16);
  if (global.dbgDisplay) {
    console.log('Generated new color: ' + generatedColor);
  }
  return generatedColor;
};

const isNull = function(param) {
  return param === null;
};

const isNullOrUndefined = function(param) {
  return param === null || param === undefined;
};

export {generateRandomColor, isNull, isNullOrUndefined};
