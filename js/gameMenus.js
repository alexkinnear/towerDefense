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
  return true;
}

const attemptToPlace = (tower) => {
  if (gameModel.currentMoney >= tower.price && isInGrid(tower) && doesntBlockPath(tower)) {
    let gridPos = convertCanvasLocationToGridPos(gameModel.placingTower.center);
    if (gameModel.grid[gridPos.row][gridPos.col].length === 0) {
      gameModel.placingTower.center = convertGridPosToCanvasLocation(gridPos);
      gameModel.grid[gridPos.row][gridPos.col].push(gameModel.placingTower);
      gameModel.activeTowers.push(gameModel.placingTower);
      gameModel.currentMoney -= tower.price;

      // updateCreepPaths having some issues
      updateCreepPaths();
    }
  }
}