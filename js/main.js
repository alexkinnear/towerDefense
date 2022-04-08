// We could probably move this to our rendering file once we have one
let canvas = document.getElementById('game-canvas');
let context = canvas.getContext('2d');

// The gameModel is created at startup and
let gameModel = initializeGameModel();


// Any active events are updated
function update() {
    gameModel.update(elapsedTime);
}

// Events that need reporting are displayed
function render() {
    gameModel.render()
}

function gameLoop(timeStamp) {
    elapsedTime = timeStamp - prevTime;
    prevTime = timeStamp;
    // console.log("FPS: ", 1000 / elapsedTime);
    update(elapsedTime);
    render();
    if (gameModel.isRunning) {
        // new call to gameLoop
        requestAnimationFrame(gameLoop);
    }
}

setupMenuButtons(gameModel);
// The gameloop will start when the new game button is clicked on the main menu
