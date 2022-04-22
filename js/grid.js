// creates a 2d array of size row/col
function initializeGrid(rows, cols) {
    let grid = [];
    for (let i = 0; i < rows; i++) {
        grid.push([]);
        for (let j = 0; j < cols; j++) {
            grid[i].push([]);
        }
    }
    return grid;
}

// Checks if row and col are in bounds and an empty space
function isOpenSpace(row, col) {
    if (row < 0 || col < 0 || row >= gameModel.grid.length || col >= gameModel.grid[row].length) {
        return false;
    }
    return gameModel.grid[row][col].length === 0 || !gameModel.grid[row][col][0].hasOwnProperty('price');
}

// Gets the distance between current pos and end without consideration for obstacles
function expectedDistance(curr, end) {
    return Math.abs(curr.row - end.row) + Math.abs(curr.col - end.col);
}

// returns a list of all open neighboring locations
function getNeighbors(curr) {
    let neighbors = []
    if (isOpenSpace(curr.row + 1, curr.col)) {neighbors.push({row: curr.row+1, col: curr.col})} // check down
    if (isOpenSpace(curr.row - 1, curr.col)) {neighbors.push({row: curr.row-1, col: curr.col})} // check up
    if (isOpenSpace(curr.row, curr.col + 1)) {neighbors.push({row: curr.row, col: curr.col+1})} // check right
    if (isOpenSpace(curr.row, curr.col - 1)) {neighbors.push({row: curr.row, col: curr.col-1})} // check left
    return neighbors;
}

function sortByPriority(queue, end) {
    for (let i = 0; i < queue.length; i++) {
        if (!queue[i].hasOwnProperty('priority')) {
            queue[i].priority = expectedDistance(queue[i], end);
        }

    }
    queue.sort((a, b) => (a.priority > b.priority) ? 1 : -1);
}

function removeRepeatValues(queue, visited) {
    let reduced = []
    for (let i = 0; i < queue.length; i++) {
        let remove = false;
        for (let j = 0; j < visited.length; j++) {
            if (queue[i].row === visited[j].row && queue[i].col === visited[j].col) {
                remove = true;
                break;
            }
        }
        if (!remove) reduced.push(queue[i]);
    }
    return reduced;
}

function getPath(visited) {
    let priorities = [];
    let path = [];
    for (let i = visited.length - 1; i >= 0; i--) {
        if (!priorities.includes(visited[i].priority)) {
            priorities.push(visited[i].priority);
            path.push(visited[i]);
        }
    }
    return path;
}

function getShortestAirPath(start, end) {
    let temp = JSON.parse(JSON.stringify(gameModel.grid));
    for (let i = 0; i > gameModel.GRID_SIZE; i++) {
        for (let j = 0; j < gameModel.GRID_SIZE; j++) {
            gameModel.grid[i][j] = [];
        }
    }
    let path = getShortestPath(start, end, false);
    gameModel.grid = temp;
    return path;
}

// Greedy solution that returns objects with position of the shortest path
function getShortestPath(start, end, air) {
    if (air) {
        return getShortestAirPath(start, end);
    }

    if (!isOpenSpace(start.row, start.col) || !isOpenSpace(end.row, end.col)) {
        return [];
    }
    let visited = [];
    let queue = [];
    queue.push(start);

    while (queue.length > 0) {
        let curr = queue.shift();   // Get the position with the shortest projected path to end
        visited.push(curr);
        if (curr.row === end.row && curr.col === end.col) {
            return getPath(visited);
        }
        queue = queue.concat(getNeighbors(curr));
        queue = removeRepeatValues(queue, visited);
        sortByPriority(queue, end);
    }
    return [];
}




