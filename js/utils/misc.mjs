const generateRandomColor = function() {
  const minColor = 0x555555;
  const maxColor = 0xdddddd;
  const generatedColor = '#' + Math.floor(
      minColor + Math.random() * maxColor).toString(16);
  if (window.dbgDisplay) {
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

const clamp = (x, min, max) => {
  if (x < min) {
    x = min;
  }

  if (x > max) {
    x = max;
  }

  return x;
};

export {generateRandomColor, isNull, isNullOrUndefined, clamp};
