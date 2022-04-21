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
      this.GRID_SIZE = 16;
      this.displayGrid = false;
      this.GRID_OFFSET = canvas.height / 10;
      this.grid = initializeGrid(this.GRID_SIZE, this.GRID_SIZE);
      this.creepId = 0;
      this.activeCreeps = [];
      this.activeTowers = [];
      this.activeBullets = [];
      this.scoreIndicators = [];
      this.bulletId = 0;
      this.placingTower = null;
      this.explosionParticleSystems = [];
      this.towerMenu = initializeTowerMenu();
      this.selectedTowerMenu = null;
      this.currentMoney = 1000;
      this.currentLevel = createLevel(1, 'left', 'right', 10, 30, 3);
      this.levelNum = 1;
      this.startLevel = false;
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
        gameModel.startLevel = true;
    },

    update(elapsedTime) {
        this.prevTime = this.elapsedTime;
        this.elapsedTime += elapsedTime;
        this.keyboard.processInput();
        for (let creep of this.activeCreeps) {
            creep.update(elapsedTime);
        }

        for (let tower of this.activeTowers) {
            tower.update(elapsedTime);
        }

        for (let bullet of this.activeBullets) {
            bullet.update(elapsedTime);
        }

        for (let indicator of this.scoreIndicators) {
          indicator.update(elapsedTime);
        }

        for (let i = 0; i < this.explosionParticleSystems.length; i++) {
          const system = this.explosionParticleSystems[i];
          system.update(elapsedTime);
          if (system.timeEmitting > system.duration + system.avgLifetime) {
            this.explosionParticleSystems.splice(i, 1); // remove the particle system
            i--; // modified the array mid-loop, so decrement the counter
          }
        }

        if (gameModel.activeCreeps.length === 0) {
            this.currentLevel.finished = true;
            this.startLevel = false;
            // create next level
            let id = this.currentLevel + 1;
            let openings = ['left', 'right', 'top', 'bottom'];
            let entrance = id === 2 ? 'top' : openings[Math.floor(Math.random() * openings.length)];
            let idx = openings.findIndex(x => x === entrance);
            openings.splice(idx, 1);
            let exit = id === 2 ? 'bottom' : openings[Math.floor(Math.random() * openings.length)];
            let numCreeps = this.currentLevel.numCreeps * 1.5;  // Increase number of creeps by 50%
            let duration = this.currentLevel.duration * 1.2;  // Increase duration by 20%
            this.currentLevel = createLevel(id, entrance, exit, numCreeps, duration, this.currentLevel.waves);
            this.levelNum++;
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

        for (let bullet of this.activeBullets) {
            drawCircle(bullet.radius, bullet.center, bullet.color);
            if (bullet.bomb) {
                gameModel.explosionParticleSystems.push(
                  ParticleSystem({
                    center: bullet.center,
                    size: { mean: 0.5, stdev: 0.25 },
                    speed: { mean: 200, stdev: 40 },
                    lifetime: { mean: 0.1, stdev: 0.05 },
                    assetName: 'fireworkParticle',
                    duration: 0.2
                  }),
                );
            }
            else if (bullet.guided) {
                gameModel.explosionParticleSystems.push(
                    ParticleSystem({
                        center: bullet.center,
                        size: { mean: 0.5, stdev: 0.25 },
                        speed: { mean: 200, stdev: 40 },
                        lifetime: { mean: 0.1, stdev: 0.05 },
                        assetName: 'greenExplosionParticle',
                        duration: 0.2
                    }),
                );
            }
        }

        for (let system of this.explosionParticleSystems) {
          Object.getOwnPropertyNames(system.particles).forEach( function(value) {
            let particle = system.particles[value];
            renderTexture(particle);
          });
        }

        for (let indicator of this.scoreIndicators) {
          drawScoreIndicator(indicator);
        }

        drawScore(this.score);

        drawTowerMenu(gameModel.towerMenu);
        if (gameModel.placingTower) {
          renderTexture(gameModel.placingTower.base);
          renderTexture(gameModel.placingTower);
          drawTowerRange(gameModel.placingTower);
        }

        if (gameModel.selectedTower) {
          drawTowerRange(gameModel.selectedTower);
          drawSelectedTowerMenu(gameModel.selectedTower, gameModel.selectedTowerMenu);
        }

        if (!this.startLevel) {
            drawLevelInfo();
        }



    },
  }

  return gameModel;
}

