
//------------------------------------------------------------------
//
// Returns the magnitude of the 2D cross product.  The sign of the
// magnitude tells you which direction to rotate to close the angle
// between the two vectors.
//
//------------------------------------------------------------------
function crossProduct2d(v1, v2) {
  return (v1.x * v2.y) - (v1.y * v2.x);
}

//------------------------------------------------------------------
//
// Computes the angle, and direction (cross product) between two vectors.
//
//------------------------------------------------------------------
function computeAngle(rotation, ptCenter, ptTarget) {
  let v1 = {
    x : Math.cos(rotation),
    y : Math.sin(rotation)
  };
  let v2 = {
    x : ptTarget.x - ptCenter.x,
    y : ptTarget.y - ptCenter.y
  };

  v2.len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  v2.x /= v2.len;
  v2.y /= v2.len;

  let dp = v1.x * v2.x + v1.y * v2.y;
  let angle = Math.acos(dp);

  //
  // Get the cross product of the two vectors so we can know
  // which direction to rotate.
  let cp = crossProduct2d(v1, v2);

  return {
    angle : angle,
    crossProduct : cp
  };
}

//------------------------------------------------------------------
//
// Simple helper function to help testing a value with some level of tolerance.
//
//------------------------------------------------------------------
function testTolerance(value, test, tolerance) {
  return Math.abs(value - test) < tolerance;
}

function updateCreepAngle(creep) {
  if (creep.nextPos !== null) {
    let angleInfo = computeAngle(creep.rotation, creep.center, creep.nextPos);
    let tolerance = 0.05;
    if (angleInfo.crossProduct < 0 && angleInfo.angle > tolerance) {   // rotate left
      creep.rotation -= creep.rotateRate;
    }
    else if (angleInfo.crossProduct > 0 && angleInfo.angle > tolerance) {  // rotate right
      creep.rotation += creep.rotateRate;
    }
  }
}

function updateCreepPaths() {
  for (let i = 0; i < gameModel.activeCreeps.length; i++) {
    if (gameModel.activeCreeps[i].type === 'ground') {
      let creep = gameModel.activeCreeps[i];
      if (creep.gridPos.row === -1) {
        creep.path = getShortestPath(gameModel.currentLevel.entrance, gameModel.currentLevel.exit);
      }
      else {
        creep.path = getShortestPath(creep.gridPos, gameModel.currentLevel.exit);
      }
      creep.path.unshift('end');
    }
  }
}


function updateCreepPos(creep) {
  if (creep.nextPos === null && creep.elapsedTime / 1000 >= creep.enterTime) {
    getNextPos(creep);
  }
  if (creep.nextPos != null) {
    if (Math.abs(creep.center.x - creep.nextPos.x) < 1 && Math.abs(creep.center.y - creep.nextPos.y) < 1) {
      getNextPos(creep);
    }
    if (creep.center.x < creep.nextPos.x) {
      creep.center.x += creep.speed;
    }
    else {
      creep.center.x -= creep.speed;
    }
    if (creep.center.y < creep.nextPos.y) {
      creep.center.y += creep.speed;
    }
    else {
      creep.center.y -= creep.speed;
    }
  }
}

function updateCreepGridPos(creep) {
  let oldPos = creep.gridPos;
  let newPos = convertCanvasLocationToGridPos(creep.center);
  if (oldPos.row === newPos.row && oldPos.col === newPos.col) {
    return;
  }
  if (newPos.row === -1 && oldPos.row !== -1) {
    if (gameModel.grid[oldPos.row][oldPos.col].includes(creep)) {
      let idx = gameModel.grid[oldPos.row][oldPos.col].findIndex(c => c.id === creep.id);
      gameModel.grid[oldPos.row][oldPos.col].splice(idx, 1);
    }
  }
  else if (newPos.row !== -1 && oldPos.row === -1) {
    creep.gridPos = newPos;
    gameModel.grid[newPos.row][newPos.col].push(creep);
  }
  else {
    let idx = gameModel.grid[oldPos.row][oldPos.col].findIndex(c => c.id === creep.id);
    gameModel.grid[oldPos.row][oldPos.col].splice(idx, 1);
    creep.gridPos = newPos;
    gameModel.grid[newPos.row][newPos.col].push(creep);
  }
}

function distance(pt1, pt2) {
  return Math.abs(Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2)));
}

function findClosestCreep(tower) {
  let d = Math.pow(10, 1000) // Max positive number
  let idx = null;
  for (let i = 0; i < gameModel.activeCreeps.length; i++) {
    // Prevent ground tower from locking onto air target
    if (tower.airRange === null && gameModel.activeCreeps[i].type === 'air') {
      continue;
    }
    else if (tower.groundRange === null && gameModel.activeCreeps[i].type === 'ground') {
      continue;
    }
    let dis = distance(tower.center, gameModel.activeCreeps[i].center)
    if (dis < d) {
      d = dis;
      idx = i;
    }
  }
  return idx !== null ? gameModel.activeCreeps[idx] : null;
}

function updateTowerAngle(tower) {
  let creep = findClosestCreep(tower);
  if (creep !== null) {
    let angleInfo = computeAngle(tower.rotation - Math.PI / 2, tower.center, creep.center);
    let tolerance = 0.05;
    let dis = distance(tower.center, creep.center);
    if (creep.type === 'ground') {
      if (dis <= tower.groundRange) {
        if (angleInfo.crossProduct < 0 && angleInfo.angle > tolerance) {   // rotate left
          tower.rotation -= tower.rotateRate;
        }
        else if (angleInfo.crossProduct > 0 && angleInfo.angle > tolerance) {  // rotate right
          tower.rotation += tower.rotateRate;
        }
        else {
          // Add bullets at increment of fire rate
          if (tower.elapsedTime - tower.lastBulletTimeStamp >= tower.fireRate && tower.name !== 'bomber') {
            let center = {x: tower.center.x, y: tower.center.y};
            gameModel.activeBullets.push(bullet(gameModel.bulletId, center, 5, 'rgba(255, 0, 0)', creep, false));
            gameModel.bulletId++;
            tower.lastBulletTimeStamp = tower.elapsedTime;
          }
        }
      }
    }
    else {  // air creep
      if (dis <= tower.airRange) {
        if (angleInfo.crossProduct < 0 && angleInfo.angle > tolerance) {   // rotate left
          tower.rotation -= tower.rotateRate;
        }
        else if (angleInfo.crossProduct > 0 && angleInfo.angle > tolerance) {  // rotate right
          tower.rotation += tower.rotateRate;
        }
        else {
          // Add bullets at increment of fire rate
          if (tower.elapsedTime - tower.lastBulletTimeStamp >= tower.fireRate && tower.name !== 'bomber') {
            let center = {x: tower.center.x, y: tower.center.y};
            let guided = tower.name === 'Air Seeker';
            gameModel.activeBullets.push(bullet(gameModel.bulletId, center, 5, 'rgba(255, 0, 0)', creep, guided));
            gameModel.bulletId++;
            tower.lastBulletTimeStamp = tower.elapsedTime;
          }
        }
      }
    }

  }
}

const creep = (pos, assetName, maxHealth) => {
  const frameTime = 125; // in ms
  gameModel.creepId++;
  return {
    id: gameModel.creepId,
    type: assetName.slice(6, 7) < '3' ? 'ground' : 'air',
    center: pos,
    gridPos: convertCanvasLocationToGridPos(this.center),
    size: {x: 40, y: 40},
    speed: 0.5,
    rotation: 0,
    rotateRate: Math.PI / 180,
    maxHealth: maxHealth,
    currentHealth: maxHealth,
    animationIndex: 1,
    nextPos: null,
    elapsedTime: 0,
    enterTime: Math.pow(10, 1000),
    path: [],
    animationFrameTime: frameTime,
    timeLeftOnCurrFrame: frameTime,
    numOfFrames: assetName.startsWith('creep-1') ? 6 : 4, // creep-1 has 6 frames, others have 4
    assetName,
    update(elapsedTime) {
      this.timeLeftOnCurrFrame -= elapsedTime;
      if (gameModel.startLevel) {
        this.elapsedTime += elapsedTime;
        updateCreepPos(this);
        updateCreepGridPos(this);
        updateCreepAngle(this);
      }

      if (typeof this.canvasEnd !== 'undefined') {
        if (Math.abs(this.center.x - this.canvasEnd.x) < 0.5 && Math.abs(this.center.y - this.canvasEnd.y) < 0.5) {
          let idx = gameModel.activeCreeps.findIndex(creep => creep.id === this.id);
          gameModel.activeCreeps.splice(idx, 1);
        }
      }

      if (this.timeLeftOnCurrFrame <= 0) {
        this.animationIndex = this.animationIndex + 1;
        if (this.animationIndex === this.numOfFrames + 1) {
          this.animationIndex = 1;
        }
        this.timeLeftOnCurrFrame = this.animationFrameTime + this.timeLeftOnCurrFrame; // offsets based on the now negative remaining frame time
      }


    },
  }
};

const towerBase = (pos) => {
  return {
    center: pos,
    size: {x: 50, y: 50},
    rotation: 0,
    assetName: 'turret-base',
  }
}

const tower = (pos,
  {airRange, groundRange, damage, fireRate, price, effect, name, sprites, upgradePaths}) => {
  return {
    center: pos,
    size: {x: 50, y: 50},
    rotation: 0,
    rotateRate: Math.PI / 45,
    elapsedTime: 0,
    lastBulletTimeStamp: 0,
    airRange,
    groundRange,
    price,
    damage,
    fireRate,
    effect,
    name,
    level: 1,
    chosenUpgradePath: null,
    upgradePaths,
    sprites,
    assetName: sprites[0],
    base: towerBase(pos),
    update(elapsedTime) {
      this.elapsedTime += elapsedTime / 1000; // Track elapsed time in seconds
      // point the tower at the closest creep
      updateTowerAngle(this);
    },
    upgrade(upgradePath) {
      const nextUpgrade = this.upgradePaths[upgradePath][this.level - 1]
      const changingAttribute = Object.keys(nextUpgrade)[0];


      if (gameModel.currentMoney >= this.price) {
        gameModel.currentMoney -= nextUpgrade.price;
        this.level += 1;
        this.assetName = this.sprites[this.level - 1];
        this[changingAttribute] = nextUpgrade[changingAttribute];
        if (this.chosenUpgradePath === null) {
          this.chosenUpgradePath = upgradePath;
        }
        gameModel.selectedTowerMenu = initializeSelectedTowerMenu(this);
      }
    }
  }
};

// Some configuration constants to make it easier to tweak the game balance
// The upgrade paths are lists of objects showing which attribute changes for that upgrade, and the price of the upgrade
// sprites are in order of level e.g. lvl 1, 2, 3
const gunnerSpec = {
  airRange: null,
  groundRange: 200,
  damage: 10,
  fireRate: 2,
  price: 25,
  effect: null,
  name: 'Gunner',
  sprites: ['turret-4-1', 'turret-4-2', 'turret-4-3'],
  upgradePaths: [
    [{damage: 15, price: 25}, {effect: 'Slow', price: 40}], // path 0
    [{fireRate: 3, price: 25}, {effect: 'Triple Shot', price: 50}], // path 1
    [{groundRange: 250, price: 25}, {groundRange: 300, price: 30}], // path 2
  ],
}
const bomberSpec = {
  airRange: null,
  groundRange: 200,
  damage: 40,
  fireRate: 0.5,
  price: 90,
  effect: 'Explodes',
  name: 'Bomber',
  sprites: ['turret-3-1', 'turret-3-2', 'turret-3-3'],
  upgradePaths: [
    [{damage: 60, price: 80}, {effect: 'Shrapnel', price: 120}], // path 0
    [{fireRate: 1, price: 100}, {effect: 'Poison Bomb', price: 130}], // path 1
    [{groundRange: 250, price: 50}, {effect: 'Cluster Bomb', price: 150}], // path 2
  ],
}
const airSeekerSpec = {
  airRange: 200,
  groundRange: null,
  damage: 30,
  fireRate: 1,
  price: 70,
  effect: null,
  name: 'Air Seeker',
  sprites: ['turret-5-1', 'turret-5-2', 'turret-5-3'],
  upgradePaths: [
    [{damage: 50, price: 80}, {airRange: 325, price: 80}], // path 0
    [{fireRate: 1.5, price: 50}, {effect: 'Two Shot', price: 120}], // path 1
    [{airRange: 300, price: 80}, {effect: 'Sonic Missiles', price: 50}], // path 2
  ],
}
const heatSeekerSpec = {
  airRange: 225,
  groundRange: 175,
  damage: 25,
  fireRate: 1.2,
  price: 140,
  effect: null,
  name: 'Heat Seeker',
  sprites: ['turret-7-1', 'turret-7-2', 'turret-7-3'],
  upgradePaths: [
    [{damage: 40, price: 80}, {airRange: 300, price: 110}], // path 0
    [{groundRange: 250, price: 70}, {airRange: 300, price: 120}], // path 1
    [{airRange: 275, price: 80}, {damage: 50, price: 120}], // path 2
  ],
}

const gunner = (pos) => {
  return tower(pos, gunnerSpec);
}

const bomber = (pos) => {
  return tower(pos, bomberSpec);
}

const airSeeker = (pos) => {
  return tower(pos, airSeekerSpec);
}

const heatSeeker = (pos) => {
  return tower(pos, heatSeekerSpec);
}

function getDirection(pt1, pt2, velocity) {
  let dx = pt2.x - pt1.x !== 0 ? pt2.x - pt1.x : 0.01;
  let dy = pt2.y - pt1.y !== 0 ? pt2.y - pt1.y : 0.01;
  let slope = dy / dx;
  let yRate = 0;
  let xRate = 0;
  if (-1 < slope < 1) { // dx is bigger
    xRate = dx > 0 ? velocity : -velocity;
    yRate = dy > 0 ? Math.abs(velocity * slope) : -Math.abs(velocity * slope);
  }
  else {  // dy is bigger
    xRate = dx > 0 ? velocity / Math.abs(slope) : -Math.abs(velocity / slope);
    yRate = dy > 0 ? velocity : -velocity;
  }
  return {dx: xRate, dy: yRate};
}

function updateBulletPos(bullet) {
  // Move bullet toward creep and remove from gameModel.activeBullets on impact
  let diffx = Math.abs(bullet.center.x - bullet.target.center.x);
  let diffy = Math.abs(bullet.center.y - bullet.target.center.y);

  let xRate = 0;
  let yRate = 0;
  let slope = diffx / diffy;
  if (slope > 1) {
    xRate = bullet.speed;
    yRate = bullet.speed / slope;
  }
  else {
    yRate = bullet.speed;
    xRate = bullet.speed / diffy / diffx;
  }

  let dx = 0;
  let dy = 0;

  if (bullet.center.x < bullet.target.center.x) {
    bullet.center.x += xRate;
  }
  if (bullet.center.x > bullet.target.center.x) {
    bullet.center.x -= xRate;
  }
  if (bullet.center.y < bullet.target.center.y) {
    bullet.center.y += yRate;
  }
  else if (bullet.center.y > bullet.target.center.y) {
    bullet.center.y -= yRate;
  }
}

function outOfBounds(obj) {
  return (obj.x < gameModel.GRID_OFFSET || obj.y < gameModel.GRID_OFFSET || obj.x > canvas.width - gameModel.GRID_OFFSET || obj.y > canvas.height - gameModel.GRID_OFFSET);
}



const bullet = (id, pos, radius, color, target, guided) => {
  return {
    id: id,
    center: pos,
    radius: radius,
    color: color,
    speed: 3,
    target: guided ? target : JSON.parse(JSON.stringify(target)),
    guided: guided,
    direction: getDirection(pos, target.center, 3),
    update(elapsedTime) {
      if (this.guided) {
        updateBulletPos(this);
      }
      else {
        this.center.x += this.direction.dx;
        this.center.y += this.direction.dy;
      }

      // Not removing bullets properly
      if (outOfBounds(this.center)) {
        let idx = gameModel.activeBullets.findIndex(b => b.id === this.id);
        gameModel.activeBullets.splice(idx, 1);
      }
    }
  }
}

