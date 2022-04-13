const initializeGameModel = () => {
  const gameModel = {
    // Things that never need to be reset
    elapsedTime: 0,
    prevTime: 0,
    sounds: {},
    assets: {},
    keyboard: Keyboard(),
    activeScreen: document.getElementById('main-menu'),


    newGame() {
      // Things that need to be reset each time a new game is started
      this.score = 0;
      this.selectedTower = null;
      this.isRunning = true;
      this.currentLevel = 1;
      this.GRID_SIZE = 16;
      this.displayGrid = false;
      this.grid = initializeGrid(this.GRID_SIZE, this.GRID_SIZE);
      this.activeCreeps = [];
      this.activeTowers = [];
      // createGroundCreep('assets/groundCreep.png', 50, 50, {x: 50, y: 50});
      // for testing, remove these
      this.addOneOfEachCreep();
      this.addOneOfEachTower();
    },

    addOneOfEachCreep() { // testing function
      const creepTypes = 3;
      const creepColors = ['blue', 'green', 'red', 'yellow'];
      const creepHealth = 20;
      for (let creepType = 1; creepType <= creepTypes; creepType++) {
        let x = 200;
        for (let color of creepColors) {
          const newCreep = creep({x, y: creepType * 100 + 100}, `creep-${creepType}-${color}`, creepHealth);
          this.activeCreeps.push(newCreep);
          x += 100;
        }
      }
    },

    addOneOfEachTower() { // testing function
      const towerTypes = 7;
      const towerLevels = 3;
      const towerRange = 200;
      for (let towerLevel = 1; towerLevel <= towerLevels; towerLevel++) {
        let x = 200;
        for (let towerType = 1; towerType <= towerTypes; towerType++) {
          const newTower = tower({x, y: towerLevel * 100 + 400}, `turret-${towerType}-${towerLevel}`, towerRange);
          this.activeTowers.push(newTower);
          x += 100;
        }
      }
    },

    upgradeSelected() {
        // TODO: Implement this
        console.log(this.selectedTower);
    },

    sellSelected() {
        // TODO: Implement this
        console.log(this.selectedTower);
    },

    startNextLevel() {
        // TODO: Implement this
        console.log(this.currentLevel + 1);
    },

    update(elapsedTime) {
        this.prevTime = this.elapsedTime;
        this.elapsedTime += elapsedTime;
        this.keyboard.processInput();
        for (let creep of this.activeCreeps) {
          creep.update(elapsedTime);
        }
    },

    render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (this.displayGrid) {drawGrid();}
        drawArena();
        for (let tower of this.activeTowers) {
          renderTexture(tower.base);
          renderTexture(tower);
        }
        for (let creep of this.activeCreeps) {
          renderAnimatedTexture(creep);
        }
        for (let creep of this.activeCreeps) {
          drawHealthBar(50, 2, {x: creep.center.x, y: creep.center.y - 35}, creep.currentHealth / creep.maxHealth);
        }
        if (gameModel.selectedTower) {
          drawTowerRange(gameModel.selectedTower);
        }
    },
  }

  return gameModel;
}

