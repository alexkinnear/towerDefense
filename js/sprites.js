
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

const creep = (pos, assetName, maxHealth) => {
  const frameTime = 125; // in ms
  gameModel.creepId++;
  return {
    id: gameModel.creepId,
    center: pos,
    size: {x: 40, y: 40},
    speed: 0.5,
    rotation: 0,
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
      this.elapsedTime += elapsedTime;
      updateCreepPos(this);

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

const tower = (pos, assetName, {airRange, groundRange, damage, fireRate, price, effect, name}) => {
  return {
    center: pos,
    size: {x: 50, y: 50},
    rotation: 0,
    rotationSpeed: 100, // not sure what this should be yet
    airRange,
    groundRange,
    price,
    damage,
    fireRate,
    effect,
    name,
    showMenu: false,
    assetName,
    base: towerBase(pos),
    update(elapsedTime) {
      // point the tower at the right creep
    },
  }
};

// Some configuration constants to make it easier to tweak the game balance
const gunnerStats = {
  airRange: null,
  groundRange: 200,
  damage: 10,
  fireRate: 2,
  price: 25,
  effect: null,
  name: 'Gunner',
}
const bomberStats = {
  airRange: null,
  groundRange: 200,
  damage: 50,
  fireRate: 0.5,
  price: 100,
  effect: 'Explodes',
  name: 'Bomber',
}
const airSeekerStats = {
  airRange: 200,
  groundRange: null,
  damage: 30,
  fireRate: 1,
  price: 100,
  effect: null,
  name: 'Air Seeker',
}
const heatSeekerStats = {
  airRange: 250,
  groundRange: 175,
  damage: 25,
  fireRate: 1.2,
  price: 200,
  effect: null,
  name: 'Heat Seeker',
}

const gunner = (pos) => {
  return tower(pos, 'turret-4-1', gunnerStats);
}

const bomber = (pos) => {
  return tower(pos, 'turret-3-1', bomberStats);
}

const airSeeker = (pos) => {
  return tower(pos, 'turret-5-1', airSeekerStats);
}

const heatSeeker = (pos) => {
  return tower(pos, 'turret-7-1', heatSeekerStats);
}

