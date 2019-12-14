let canvas = null;
let ctx = null;

const MOVE_STEP = 2;

window.onload = function() {
    this.init();
    window.addEventListener("keydown", onMoveRequest);
    window.addEventListener("keyup", onMoveStop);
}

function init() {
    canvas = document.getElementById('game-area');
    
    startPosX = canvas.width/2;
    startPosY = canvas.height/2;
    
    x = startPosX;
    y = startPosY;

    ctx = canvas.getContext("2d");

    window.requestAnimationFrame(draw);
}

let startPosX = 0;
let startPosY = 0;
let x = 0;
let y = 0;
let dx = 0;
let dy = 0;

let ballColor = "#0095DD";

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();

    x += dx;
    y += dy;
    
    // just reset to center when fully OOB
    if (x >= canvas.width || x <= 0 || 
    y >= canvas.height || y <= 0) {
        x = startPosX;
        y = startPosY;

        ballColor = generateRandomColor();
    }

    window.requestAnimationFrame(draw);
}

function onMoveRequest(event) {
    const key = event.key;

    switch (key) {
        case "w":
            dx = 0;
            dy = -MOVE_STEP;
            break;
        
        case "s":
            dx = 0;
            dy =  MOVE_STEP;
            break;

        case "a":
            dx = -MOVE_STEP;
            dy = 0;
            break;

        case "d":
            dx = MOVE_STEP;
            dy = 0;
            break;

        default:
            break;
    }
}

function onMoveStop (event) {
    const key = event.key;

    switch (key) {
        case "w":
        case "s":
            dy = 0;
            break;

        case "a":
        case "d":
            dx = 0;
            break;

        default:
            break;
    }
}

function generateRandomColor() {
    generatedColor = '#' + Math.floor(0x121212 + Math.random() * 0xdadada).toString(16);
    console.log('Generated new color: ' + generatedColor);
    return generatedColor;
}