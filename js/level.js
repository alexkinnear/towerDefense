
function createCreep(creepType, color, creepHealth) {
    return creep({x: 0, y: 0}, `creep-${creepType}-${color}`, creepHealth);
}

function createCreeps(howMany) {
    let creeps = [];
    const creepTypes = 3;
    const creepColors = ['blue', 'green', 'red', 'yellow'];
    const creepHealth = 20;

    for (let i = 0; i < howMany; i++) {
        let color = creepColors[Math.floor(Math.random()*creepColors.length)];
        let creepType = Math.floor(Math.random() * creepTypes + 1);
        creeps.push(createCreep(creepType, color, creepHealth));
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

function createLevel(id, entrance, exit, howManyCreeps, startTime, duration) {
    let gridPos = {};
    gridPos['left'] = {row: Math.floor(gameModel.GRID_SIZE / 2), col: 0};
    gridPos['right'] = {row: Math.floor(gameModel.GRID_SIZE / 2), col: gameModel.GRID_SIZE-1};
    gridPos['top'] = {row: 0, col: Math.floor(gameModel.GRID_SIZE / 2 - 1)};
    gridPos['bottom'] = {row: gameModel.GRID_SIZE-1, col: Math.floor(gameModel.GRID_SIZE / 2 - 1)}

    let canvasPos = {};
    canvasPos['left'] = {x: 0, y: canvas.height / 2};
    canvasPos['right'] = {x: canvas.width, y: canvas.height / 2};
    canvasPos['top'] = {x: canvas.width / 2, y: 0};
    canvasPos['bottom'] = {x: canvas.width / 2, y: canvas.height};

    // fill out the creeps list with the level's creeps
    gameModel.activeCreeps = createCreeps(howManyCreeps);
    let path = getShortestPath(gridPos[entrance], gridPos[exit]);
    for (let i = 0; i < gameModel.activeCreeps.length; i++) {
        // Randomly generate the time the creeps enter the arena
        gameModel.activeCreeps[i].enterTime = duration * Random.nextDouble();
        gameModel.activeCreeps[i].path = JSON.parse(JSON.stringify(path)); // Deep copy
        gameModel.activeCreeps[i].path.unshift('end');
        gameModel.activeCreeps[i].canvasEnd = canvasPos[exit];
        setCreepPos(gameModel.activeCreeps[i], entrance);
    }
    return {
        id: id,
        entrance: gridPos[entrance],
        exit: gridPos[exit],
        startTime: startTime,
        elapsedTime: 0
    }
}