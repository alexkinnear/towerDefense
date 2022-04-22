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

  if (texture.slowed) {
    context.drawImage(
      gameModel.assets[`slowParticle`],
      center.x - size.x / 2,
      center.y - size.y / 2,
      size.x, size.y
    );
    context.drawImage(
      gameModel.assets[`slowParticle`],
      center.x - size.x / 2,
      center.y - size.y / 2,
      size.x, size.y
    );
  }

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

const drawCircle = (radius, center, color) => {
  context.save();
  context.fillStyle = color; // Bullet color
  context.lineWidth = 2;
  context.strokeStyle = '#000000'; // black outline
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();
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

const menuColors = {
  name: 'white',
  damage: 'lightcoral',
  fireRate: 'orange',
  groundRange: 'lightgreen',
  airRange: 'cyan',
  price: 'yellow',
  effect: 'gainsboro',
}

const humanTexts = {
  damage: 'Damage',
  fireRate: 'Shots/Second',
  groundRange: 'Ground Range',
  airRange: 'Air Range',
  effect: 'Effect',
}

const menuFont = '32px Arcade';

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
    drawText(hovered.name, {x: menuTopLeft.x + 12, y: menuTopLeft.y}, menuFont, menuColors.name, 'black', 0);
    drawText(`${hovered.damage} ${humanTexts.damage}`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 25}, menuFont, menuColors.damage, 'black', 0);
    drawText(`${hovered.fireRate} ${humanTexts.fireRate}`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 50}, menuFont, menuColors.fireRate, 'black', 0);
    drawText(`${hovered.groundRange || 'No'} ${humanTexts.groundRange}`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 75}, menuFont, menuColors.groundRange, 'black', 0);
    drawText(`${hovered.airRange || 'No'} ${humanTexts.airRange}`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 100}, menuFont, menuColors.airRange, 'black', 0);
    drawText(`$${hovered.price}`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 125}, menuFont, menuColors.price, 'black', 0);
    drawText(`${hovered.effect || ''}`, {x: menuTopLeft.x + 12, y: menuTopLeft.y + 150}, menuFont, menuColors.effect, 'black', 0);
  }
  // current $$
  drawText(`$${gameModel.currentMoney}`, {x: 12, y: 0}, menuFont, 'yellow', 'black', 0);
}

const drawUpgradeMenu = (upgradePath, selectedTowerMenu, tower) => {
  let {center, size, changingAttribute, upgradeText, upgradeButton} = selectedTowerMenu.upgradeMenus[upgradePath];
  let topLeft = {x: center.x - size.x / 2, y: center.y - size.y / 2}
  drawRectangle(size, center, "#777777");
  
  drawText(upgradePath + 1, {x: topLeft.x + size.x - 25, y: topLeft.y}, menuFont, menuColors.effect, 'black', 0);


  //account for max level towers
  if (tower.level > 2) {
    drawText('Fully Upgraded', {x: topLeft.x + 10, y: topLeft.y}, menuFont, menuColors.name, 'black', 0);
    return;
  }
  
  drawText(humanTexts[changingAttribute], {x: topLeft.x + 10, y: topLeft.y}, menuFont, menuColors[changingAttribute], 'black', 0);
  drawText(upgradeText, {x: topLeft.x + 10, y: topLeft.y + 25}, menuFont, menuColors[changingAttribute], 'black', 0);

  const buttonTopLeft = {x: upgradeButton.center.x - upgradeButton.size.x / 2, y: upgradeButton.center.y - upgradeButton.size.y / 2};
  drawRectangle(upgradeButton.size, upgradeButton.center, "#aaaaaa");
  drawText(upgradeButton.text, {x: buttonTopLeft.x + 5, y: buttonTopLeft.y - 5}, menuFont, menuColors.price, 'black', 0);
}

const drawSellButton = ({sellButton}) => {
  const {center, size, text} = sellButton;
  const buttonTopLeft = {x: center.x - size.x / 2, y: center.y - size.y / 2};
  drawRectangle(size, center, "#aaaaaa");
  drawText(text, {x: buttonTopLeft.x + 5, y: buttonTopLeft.y - 5}, menuFont, menuColors.price, 'black', 0);
}

const drawSelectedTowerMenu = (tower, selectedTowerMenu) => {
  if (tower.chosenUpgradePath !== null) { // only show the menu for the upgrade path taken
    drawUpgradeMenu(tower.chosenUpgradePath, selectedTowerMenu, tower);
  } else { // tower has never been upgraded, show all upgrade menus
    drawUpgradeMenu(0, selectedTowerMenu, tower);
    drawUpgradeMenu(1, selectedTowerMenu, tower);
    drawUpgradeMenu(2, selectedTowerMenu, tower);
  }
  drawSellButton(selectedTowerMenu);
}

function drawLevelInfo() {
  drawText(`Level ${gameModel.levelNum}`, {x: 10, y: 70}, 'arial', '#FF0000', '#000000', 0);
  drawText(`Entrance: ${gameModel.currentLevel.entranceString}`, {x: 10, y: 85}, 'arial', '#FF0000', '#000000', 0);
  drawText(`Exit: ${gameModel.currentLevel.exitString}`, {x: 10, y: 100}, 'arial', '#FF0000', '#000000', 0);
}

function drawScoreIndicator(scoreIndicator) {
  drawText(scoreIndicator.text, scoreIndicator.center, '12px arial', menuColors.effect, 'black', 0);
}

function drawScore(score) {
  drawText(score, {x: 10, y: 40}, '24px arial', menuColors.effect, 'black', 0);
}

function drawLives(lives) {
  const firstLife = {x: 925, y: 25};
  for (let i = 0; i < lives; i++) {
    renderTexture({
      center: {x: firstLife.x + i * 25, y: firstLife.y},
      size: {x: 25, y: 25},
      assetName: 'heart',
      rotation: 0,
    })
  }
}

function drawGameOver() {
  drawText('Game Over', {x: 350, y: 400}, '64px Arcade', menuColors.damage, 'black', 0);
  drawText(`Final Score: ${gameModel.score}`, {x: 275, y: 450}, '64px Arcade', menuColors.damage, 'black', 0);
  drawText('Press [Esc] to exit', {x: 200, y: 500}, '64px Arcade', menuColors.damage, 'black', 0);
}
