
function createCreep(creepType, color, creepHealth) {
    return creep({x: 0, y: 0}, `creep-${creepType}-${color}`, creepHealth);
}

function createCreeps(howMany) {
    let creeps = [];
    const creepTypes = gameModel.levelNum > 2 ? 3 : 2;
    const creepColors = ['blue', 'green', 'red', 'yellow'];
    const creepHealth = {
        'blue': 50,
        'green': 100,
        'red': 150,
        'yellow': 200
    }

    for (let i = 0; i < howMany; i++) {
        let color = creepColors[Math.floor(Math.random()*creepColors.length)];
        let creepType = Math.floor(Math.random() * creepTypes + 1);
        creeps.push(createCreep(creepType, color, creepHealth[color]));
    }
    return creeps;
}

function setCreepPos(creep, entrance) {
    if (entrance === 'left') {
        creep.center = {x: 0, y: canvas.height / 2};
    } else if (entrance === 'right') {
        creep.center = {x: canvas.width, y: canvas.height / 2};
    } else if (entrance === 'top') {
        creep.center = {x: canvas.width / 2, y: 0};
    } else { // bottom
        creep.center = {x: canvas.width / 2, y: 0}
    }
}

function convertGridPosToCanvasLocation(gridPos) {
    let cellSize = (canvas.width - (gameModel.GRID_OFFSET * 2)) / gameModel.GRID_SIZE;
    let x = gameModel.GRID_OFFSET + (cellSize / 2) + (gridPos.col * cellSize);
    let y = gameModel.GRID_OFFSET + (cellSize / 2) + (gridPos.row * cellSize);
    return {x: x, y: y}
}

function convertCanvasLocationToGridPos(canvasLoc) {
    if (typeof canvasLoc === 'undefined') return {row: -1, col: -1};
    let cellSize = (canvas.width - (gameModel.GRID_OFFSET * 2)) / gameModel.GRID_SIZE;
    let col = Math.floor((canvasLoc.x - gameModel.GRID_OFFSET) / cellSize);
    let row = Math.floor((canvasLoc.y - gameModel.GRID_OFFSET) / cellSize);
    if (row < 0 || col < 0 || row >= gameModel.GRID_SIZE || col >= gameModel.GRID_SIZE) {return {row: -1, col: -1}}
    return {row: row, col: col};
}


function getNextPos(creep) {
    if (creep.path.length > 0) {
        let loc = creep.path.pop();
        // Exit condition
        if (loc === 'end') {
            if (creep.center.x > canvas.width / 1.5) {
                creep.nextPos = {x: canvas.width, y: canvas.height / 2};
            }
            else if (creep.center.x < canvas.width / 4) {
                creep.nextPos = {x: 0, y: canvas.height / 2};
            }
            else if (creep.center.y > canvas.width / 1.5) {
                creep.nextPos = {x: canvas.width / 2, y: canvas.height};
            }
            else {
                creep.nextPos = {x: canvas.width / 2, y: 0};
            }
        }
        else {
            creep.nextPos = convertGridPosToCanvasLocation(loc);
        }

    }
}

function getEntranceandExitPos() {
    let gridPos = {};
    let entrancePriority = [7, 8, 9, 6];
    while (entrancePriority.length > 0) {
        let gp = entrancePriority.pop();
        if (isOpenSpace(gp, 0)) {
            gridPos['left'] = {row: gp, col: 0};
        }
        if (isOpenSpace(gp, 15)) {
            gridPos['right'] = {row: gp, col: 15};
        }
        if (isOpenSpace(0, gp)) {
            gridPos['top'] = {row: 0, col: gp};
        }
        if (isOpenSpace(15, gp)) {
            gridPos['bottom'] = {row: 15, col: gp};
        }
    }
    return gridPos;
}

function createLevel(id, entrance, exit, howManyCreeps, duration, numWaves) {

    let gridPos = getEntranceandExitPos();
    // gridPos['left'] = {row: Math.floor(gameModel.GRID_SIZE / 2), col: 0};
    // gridPos['right'] = {row: Math.floor(gameModel.GRID_SIZE / 2), col: gameModel.GRID_SIZE-1};
    // gridPos['top'] = {row: 0, col: Math.floor(gameModel.GRID_SIZE / 2 - 1)};
    // gridPos['bottom'] = {row: gameModel.GRID_SIZE-1, col: Math.floor(gameModel.GRID_SIZE / 2 - 1)};

    let canvasPos = {};
    canvasPos['left'] = {x: 0, y: canvas.height / 2};
    canvasPos['right'] = {x: canvas.width, y: canvas.height / 2};
    canvasPos['top'] = {x: canvas.width / 2, y: 0};
    canvasPos['bottom'] = {x: canvas.width / 2, y: canvas.height};

    let waves = [];
    for (let i = 0; i < numWaves; i++) {
        let bounds = {};
        bounds['min'] = duration/numWaves*i;
        bounds['max'] = duration/numWaves*i + duration / numWaves / 2;
        waves.push(bounds);
    }

    // fill out the creeps list with the level's creeps
    gameModel.activeCreeps = createCreeps(howManyCreeps);
    let path = getShortestPath(gridPos[entrance], gridPos[exit], false);
    let airPath = getShortestPath(gridPos[entrance], gridPos[exit], true);
    for (let i = 0; i < gameModel.activeCreeps.length; i++) {
        // Randomly generate the time the creeps enter the arena
        let whichWave = waves[Math.floor(Math.random() * waves.length)];
        gameModel.activeCreeps[i].enterTime = Math.random() * (whichWave.max - whichWave.min) + whichWave.min;
        if (gameModel.activeCreeps[i].type === 'air') {
            gameModel.activeCreeps[i].path = JSON.parse(JSON.stringify(airPath));
        }
        else {
            gameModel.activeCreeps[i].path = JSON.parse(JSON.stringify(path)); // Deep copy
        }
        gameModel.activeCreeps[i].path.unshift('end');
        gameModel.activeCreeps[i].canvasEnd = canvasPos[exit];
        setCreepPos(gameModel.activeCreeps[i], entrance);
    }
    return {
        id: id,
        entrance: gridPos[entrance],
        entranceString: entrance,
        exit: gridPos[exit],
        exitString: exit,
        numCreeps: howManyCreeps,
        duration: duration,
        waves: numWaves,
        startTime: 0,
        elapsedTime: 0,
        finished: false
    }
}