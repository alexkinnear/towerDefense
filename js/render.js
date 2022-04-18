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

  let {center, size, rotation, assetName} = texture;
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

const drawRectangle = (size, center, color) => {
  context.save();

  context.fillStyle = color; // green bar
  context.fillRect(center.x - size.x / 2, center.y - size.y / 2, size.x, size.y);
  context.lineWidth = 2;
  context.strokeStyle = '#000000'; // black outline
  context.strokeRect(center.x - size.x / 2 - context.lineWidth, center.y - size.y / 2 - context.lineWidth, size.x + 2 * context.lineWidth, size.y + 2 * context.lineWidth);

  context.restore();
}

const drawTowerRange = (tower) => {  
  if (tower.groundRange) {
    context.save();
    context.lineWidth = 2;
    context.fillStyle =  '#90EE9033'; // slightly transparent green
    context.strokeStyle =  '#90EE9033'; // slightly transparent green
    context.beginPath();
    context.arc(tower.center.x, tower.center.y, tower.groundRange, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.restore();
  }
  if (tower.airRange) {
    context.save();
    context.lineWidth = 3;
    context.fillStyle =  '#00FFFF33'; // slightly transparent cyan
    context.strokeStyle =  '#00FFFF33'; // slightly transparent cyan
    context.beginPath();
    context.arc(tower.center.x, tower.center.y, tower.airRange, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.restore();
  }
};

const drawText = (text, pos, font, fillColor, strokeColor, rotation) => {
  context.save();

  context.font = font;
  const height = context.measureText('m').width;
  const width = context.measureText(text).width;

  context.font = font;
  context.fillStyle = fillColor;
  context.strokeStyle = strokeColor;
  context.lineWidth = 2;
  context.textBaseline = 'top';

  context.translate(pos.x + width / 2, pos.y + height / 2);
  context.rotate(rotation);
  context.translate(-(pos.x + width / 2), -(pos.y + height / 2));
  
  context.fillText(text, pos.x, pos.y);
  // context.strokeText(text,pos.x, pos.y);
  
  context.restore();
};

const drawTowerMenu = (towerMenu) => {
  // tower icons
  for (let i = 0; i < towerMenu.towerSprites.length; i++) {
    const towerSprite = towerMenu.towerSprites[i];
    drawRectangle({x: 50, y: 50}, towerSprite.center, "#777777")
    renderTexture(towerSprite.base);
    renderTexture(towerSprite);
  }
  // details menu when an icon is hovered
  const hovered = towerMenu.hovered;
  if (hovered) {
    const menuCenter = {x: 762.5, y: 190};
    const menuSize = {x: 275, y: 200};
    const menuTopLeft = {x: menuCenter.x - menuSize.x / 2, y: menuCenter.y - menuSize.y / 2}
    drawRectangle(menuSize, menuCenter, "#777777");
    drawText(`${hovered.name}`, {x: menuTopLeft.x + 12, y: menuTopLeft.y}, '32px Arcade', 'white', 'black', 0);
    drawText(`${hovered.damage} Damage`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 25}, '32px Arcade', 'lightcoral', 'black', 0);
    drawText(`${hovered.fireRate} Shots/Second`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 50}, '32px Arcade', 'orange', 'black', 0);
    drawText(`${hovered.groundRange || 'No'} Ground Range`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 75}, '32px Arcade', 'lightgreen', 'black', 0);
    drawText(`${hovered.airRange || 'No'} Air Range`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 100}, '32px Arcade', 'cyan', 'black', 0);
    drawText(`$${hovered.price}`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 125}, '32px Arcade', 'yellow', 'black', 0);
    drawText(`${hovered.effect || ''}`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 150}, '32px Arcade', 'gainsboro', 'black', 0);
  }
  // current $$
  drawText(`$${gameModel.currentMoney}`, {x: 12, y: 0}, '48px Arcade', 'yellow', 'black', 0);
}
