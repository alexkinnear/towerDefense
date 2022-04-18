// Draws the main area for tower defense with exits north, south, east, and west
function drawArena() {
    let offset = gameModel.GRID_OFFSET;
    context.strokeStyle = 'rgba(0, 130, 200, 1)';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(0, canvas.height / 2 + offset);
    context.lineTo(offset, canvas.height / 2 + offset);
    context.lineTo(offset, canvas.height - offset);
    context.lineTo(canvas.width / 2 - offset, canvas.height - offset);
    context.lineTo(canvas.width / 2 - offset, canvas.height);
    context.moveTo(canvas.width / 2 + offset, canvas.height);
    context.lineTo(canvas.width / 2 + offset, canvas.height - offset);
    context.lineTo(canvas.width - offset, canvas.height - offset);
    context.lineTo(canvas.width - offset, canvas.height / 2 + offset);
    context.lineTo(canvas.width, canvas.height / 2 + offset);
    context.moveTo(canvas.width, canvas.height / 2 - offset);
    context.lineTo(canvas.width - offset, canvas.height / 2 - offset);
    context.lineTo(canvas.width - offset, canvas.height / 2 - offset);
    context.lineTo(canvas.width - offset, offset);
    context.lineTo(canvas.width / 2 + offset, offset);
    context.lineTo(canvas.width / 2 + offset, 0);
    context.moveTo(canvas.width / 2 - offset, 0);
    context.lineTo(canvas.width / 2 - offset, offset);
    context.lineTo(offset, offset);
    context.lineTo(offset, canvas.height / 2 - offset);
    context.lineTo(0, canvas.height / 2 - offset);
    context.moveTo(0, 0);
    context.closePath();
    context.stroke();
}

function drawGrid() {
    context.strokeStyle = 'rgba(255, 255, 255, 1)';
    context.lineWidth = 1;
    let offset = gameModel.GRID_OFFSET;
    let cellSize = (canvas.width - offset * 2) / gameModel.GRID_SIZE;

    context.beginPath();
    for (let i = 0; i < gameModel.GRID_SIZE + 1; i++) {
        // horizontal lines
        context.moveTo(offset, i * cellSize + offset);
        context.lineTo(canvas.width - offset, i * cellSize + offset);
        // vertical lines
        context.moveTo(i * cellSize + offset, offset);
        context.lineTo(i * cellSize + offset, canvas.height - offset);

    }

    context.closePath();
    context.stroke();
}

function toggleGrid() {
    gameModel.displayGrid = !gameModel.displayGrid;
}