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
      this.GRID_OFFSET = canvas.height / 10;
      this.grid = initializeGrid(this.GRID_SIZE, this.GRID_SIZE);
      this.creepId = 0;
      this.activeCreeps = [];
      this.activeTowers = [];
      this.placingTower = null;
      this.explosionParticleSystems = [];
      this.towerMenu = initializeTowerMenu();
      this.currentMoney = 1000;
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
        this.levelInfo = createLevel(1, 'left', 'top', 10, 0, 30);
    },

    update(elapsedTime) {
        this.prevTime = this.elapsedTime;
        this.elapsedTime += elapsedTime;
        this.keyboard.processInput();
        for (let creep of this.activeCreeps) {
          creep.update(elapsedTime);
        }
        for (let i = 0; i < this.explosionParticleSystems.length; i++) {
          const system = this.explosionParticleSystems[i];
          system.update(elapsedTime);
          if (system.timeEmitting > system.duration + system.avgLifetime) {
            this.explosionParticleSystems.splice(i, 1); // remove the particle system
            i--; // modified the array mid-loop, so decrement the counter
          }
        }
    },

    render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (this.displayGrid) {drawGrid();}
        drawArena();
        for (let tower of this.activeTowers) {
            tower.base.center = tower.center;
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

        for (let system of this.explosionParticleSystems) {
          Object.getOwnPropertyNames(system.particles).forEach( function(value) {
            let particle = system.particles[value];
            renderTexture(particle);
          });
        }

        drawTowerMenu(gameModel.towerMenu);
        if (gameModel.placingTower) {
          renderTexture(gameModel.placingTower.base);
          renderTexture(gameModel.placingTower);
          drawTowerRange(gameModel.placingTower);
        }
    },
  }

  return gameModel;
}

