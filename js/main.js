// We could probably move this to our rendering file once we have one
let canvas = document.getElementById('game-canvas');
let context = canvas.getContext('2d');


let gameModel = {
    elapsedTime: 0,
    prevTime: 0,
    score: 0,
    sounds: {},
    keyboard: Keyboard(),
    activeScreen: document.getElementById('main-menu'),
    selectedTower: null,
    currentLevel: 0,

    upgradeSelected() {
        // TODO: Implement this
        console.log(selectedTower);
    },

    sellSelected() {
        // TODO: Implement this
        console.log(selectedTower);
    },

    startNextLevel() {
        // TODO: Implement this
        console.log(currentLevel + 1);
    },

    update(elapsedTime) {
        this.prevTime = this.elapsedTime;
        this.elapsedTime += elapsedTime;
    },

    render() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fill();
    }
}


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
    update(elapsedTime);
    render();
    // new call to gameLoop
    requestAnimationFrame(gameLoop);
}

setupMenuButtons(gameModel);


// The gameloop will start when the new game button is clicked on the main menu
// gameLoop(performance.now())