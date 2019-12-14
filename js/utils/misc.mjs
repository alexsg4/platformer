const generateRandomColor = function() {
    const generatedColor = '#' + Math.floor(0x121212 + Math.random() * 0xdadada).toString(16);
    if (document.dbgDisplay) {
        console.log('Generated new color: ' + generatedColor);
    }
    return generatedColor;
};

export { generateRandomColor };
