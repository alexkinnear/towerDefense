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
      this.GRID_SIZE = 8;
      this.displayGrid = false;
      this.grid = initializeGrid(this.GRID_SIZE, this.GRID_SIZE);
      this.activeCreeps = []
      createGroundCreep('assets/groundCreep.png', 50, 50, {x: 50, y: 50});
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
    },

    render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (this.displayGrid) {drawGrid();}
        drawArena();
    },
  }

  return gameModel;
}

