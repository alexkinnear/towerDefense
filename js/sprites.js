
const creep = (pos, assetName) => {
  const frameTime = 125; // in ms
  return {
    center: pos,
    size: {x: 50, y: 50},
    rotation: 0,
    animationIndex: 1,
    animationFrameTime: frameTime,
    timeLeftOnCurrFrame: frameTime,
    numOfFrames: assetName.startsWith('creep-1') ? 6 : 4, // creep-1 has 6 frames, others have 4
    assetName,
    update(elapsedTime) {
      this.timeLeftOnCurrFrame -= elapsedTime;
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

const tower = (pos, assetName) => {
  return {
    center: pos,
    size: {x: 50, y: 50},
    rotation: 0,
    rotationSpeed: 100, // not sure what this should be yet
    assetName,
    base: towerBase(pos),
    update(elapsedTime) {
      // point the tower at the right creep
    },
  }
};

