// Draws the main area for tower defense with exits north, south, east, and west
function drawArena() {
    let offset = canvas.height / 10;
    context.strokestyle = 'rgba(255, 0, 0, 1)';
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(0, canvas.height / 2 + offset);
    context.lineTo(offset, canvas.height / 2 + offset);
    context.lineTo(offset, canvas.height - offset);
    context.lineTo(canvas.width / 2 - offset, canvas.height - offset);
    context.lineTo(canvas.width / 2 - offset, canvas.height);
    context.lineTo(canvas.width / 2 + offset, canvas.height);
    context.lineTo(canvas.width / 2 + offset, canvas.height - offset);
    context.lineTo(canvas.width - offset, canvas.height - offset);
    context.lineTo(canvas.width - offset, canvas.height / 2 + offset);
    context.lineTo(canvas.width, canvas.height / 2 + offset);
    context.lineTo(canvas.width, canvas.height / 2 - offset);
    context.lineTo(canvas.width - offset, canvas.height / 2 - offset);
    context.lineTo(canvas.width - offset, canvas.height / 2 - offset);
    context.lineTo(canvas.width - offset, offset);
    context.lineTo(canvas.width / 2 + offset, offset);
    context.lineTo(canvas.width / 2 + offset, 0);
    context.lineTo(canvas.width / 2 - offset, 0);
    context.lineTo(canvas.width / 2 - offset, offset);
    context.lineTo(offset, offset);
    context.lineTo(offset, canvas.height / 2 - offset);
    context.lineTo(0, canvas.height / 2 - offset);
    context.closePath();
    context.stroke();
}