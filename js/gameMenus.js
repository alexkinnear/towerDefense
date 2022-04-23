const initializeTowerMenu = () => {
  let towerSprites = [
    gunner({x: 650, y: 50}),
    bomber({x: 725, y: 50}),
    airSeeker({x: 800, y: 50}),
    heatSeeker({x: 875, y: 50}),
  ];

  let towerMenu = {
    towerSprites,
    hovered: null,
  }
  
  return towerMenu;
}

const isInGrid = (tower) => {
  const {x, y} = tower.center
  return x > 100 && x < 900 && y > 100 && y < 900;
}

const doesntBlockPath = (tower) => {
  // TODO: make sure tower doesn't block paths between any 2 exits
  // Check left to right
  let towerGrid = convertCanvasLocationToGridPos(tower.center);
  gameModel.grid[towerGrid.row][towerGrid.col].push(tower);
  let gp = getEntranceandExitPos();
  if (typeof gp['left'] === 'undefined' || typeof gp['right'] === 'undefined' || typeof gp['top'] === 'undefined' || typeof gp['bottom'] === 'undefined') {
    gameModel.grid[towerGrid.row][towerGrid.col].pop();
    return false;
  }
  let leftToRight = getShortestPath(gp['left'], gp['right']).length > 0;
  let topToBottom = getShortestPath(gp['top'], gp['bottom']).length > 0;
  gameModel.grid[towerGrid.row][towerGrid.col].pop();
  return leftToRight && topToBottom;
}

const attemptToPlace = (tower) => {
  if (gameModel.currentMoney >= tower.price && isInGrid(tower) && doesntBlockPath(tower)) {
    let gridPos = convertCanvasLocationToGridPos(gameModel.placingTower.center);
    if (gameModel.grid[gridPos.row][gridPos.col].length === 0) {
      gameModel.grid[gridPos.row][gridPos.col].push(gameModel.placingTower);
      gameModel.activeTowers.push(gameModel.placingTower);
      gameModel.currentMoney -= tower.price;

      let gp = getEntranceandExitPos();
      gameModel.currentLevel.entrance = gp[gameModel.currentLevel.entranceString];
      gameModel.currentLevel.exit = gp[gameModel.currentLevel.exitString];
      gameModel.currentLevel.exit = gp[gameModel.currentLevel.exitString];
      updateCreepPaths();
      const audioClone = gameModel.assets['towerUpgrade'].cloneNode();
      audioClone.play();
      console.log(gameModel.activeCreeps);

    }
  }
}

const menuSize = {x: 295, y: 90};
const buttonSize = {x: 80, y: 25};

const upgradeMenu = (upgradePath, center, tower) => {
  if (tower.level > 2) {
    return {
      center: center,
      size: menuSize,
      upgradeText: '',
      changingAttribute: '',
      upgradeButton: null,
    };
  }
  const nextUpgrade = tower.upgradePaths[upgradePath][tower.level - 1]
  const changingAttribute = Object.keys(nextUpgrade)[0];

  let upgradeText = '';
  if (tower[changingAttribute] === null || changingAttribute === 'effect') {
    upgradeText = `> ${nextUpgrade[changingAttribute]}`
  } else {
    upgradeText = `${tower[changingAttribute]} > ${nextUpgrade[changingAttribute]}`;
  }

  return {
    center: center,
    size: menuSize,
    upgradeText,
    changingAttribute,
    upgradeButton: {
      center: {x: center.x + menuSize.x / 2 - buttonSize.x / 2 - 10, y: center.y + menuSize.y / 2 - buttonSize.y / 2 - 10},
      size: buttonSize,
      text: `$${nextUpgrade.price}`,
    }
  }
}

const newSellButton = ({center, price}) => {
  return {
    center: {x: center.x, y: center.y + 50},
    size: {x: 190, y: buttonSize.y},
    text: `Sell for $${Math.round(price * 0.7)}`,
  }
}

const initializeSelectedTowerMenu = (tower) => {
  
  const menu0Center = {x: 247.5, y: 50};
  const menu1Center = {x: 247.5, y: 50 + 900};
  const menu2Center = {x: 247.5 + 505, y: 50 + 900};
  let upgradeMenus = [
    upgradeMenu(0 ,menu0Center, tower),
    upgradeMenu(1, menu1Center, tower),
    upgradeMenu(2, menu2Center, tower),
  ];

  let sellButton = newSellButton(tower);

  let selectedTowerMenu = {
    upgradeMenus,
    sellButton,
  }
  
  return selectedTowerMenu;
}