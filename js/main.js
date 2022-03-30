
let canvas = document.getElementById('id-canvas');
let context = canvas.getContext('2d');


let gameModel = {
    elapsedTime: 0,
    prevTime: 0,
    score: 0,
    sounds: {},

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




gameLoop(performance.now())