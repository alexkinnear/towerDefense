const renderAnimatedTexture = (texture) => {
  context.save()

  let {center, size, rotation, assetName, animationIndex} = texture;
  context.translate(center.x, center.y);
  context.rotate(rotation);
  context.translate(-center.x, -center.y);

  context.drawImage(
    gameModel.assets[`${assetName}/${animationIndex}`],
    center.x - size.x / 2,
    center.y - size.y / 2,
    size.x, size.y
  );

  context.restore();
}

const renderTexture = (texture) => {
  context.save()

  let {center, size, rotation, assetName, animationIndex} = texture;
  context.translate(center.x, center.y);
  context.rotate(rotation);
  context.translate(-center.x, -center.y);

  context.drawImage(
    gameModel.assets[`${assetName}`],
    center.x - size.x / 2,
    center.y - size.y / 2,
    size.x, size.y
  );

  context.restore();
}

const drawHealthBar = (width, height, center, currentHealthPercentage) => {
  context.save();
  
  context.fillStyle =  '#FF0000'; // red bar
  context.fillRect(center.x - width / 2, center.y - height / 2, width, height);

  context.fillStyle =  '#00FF00'; // green bar
  context.fillRect(center.x - width / 2, center.y - height / 2, width * currentHealthPercentage, height);
  context.lineWidth = 1.5;
  context.strokeStyle = '#000000'; // black outline
  context.strokeRect(center.x - width / 2 - context.lineWidth, center.y - height / 2 - context.lineWidth, width + 2 * context.lineWidth, height + 2 * context.lineWidth);

  context.restore();
}

const drawTowerRange = (tower) => {
  context.save();
  
  context.fillStyle =  '#66666666'; // slightly transparent grey
  context.strokeStyle =  '#66666666'; // slightly transparent grey
  context.beginPath();
  context.arc(tower.center.x, tower.center.y, tower.range, 0, 2 * Math.PI);
  context.fill();
  context.stroke();

  context.restore();
};
