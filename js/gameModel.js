const initializeGameModel = () => {
  const gameModel = {
    // Things that never need to be reset
    elapsedTime: 0,
    prevTime: 0,
    sounds: {},
    keyboard: Keyboard(),
    activeScreen: document.getElementById('main-menu'),

    newGame() {
      // Things that need to be reset each time a new game is started
      this.score = 0;
      this.selectedTower = null;
      this.isRunning = true;
      this.currentLevel = 1;
      this.grid = initializeGrid(8, 8);
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

  getPath() {
      for (let row = 0; row < this.grid.length; row++) {
          for (let col = 0; col < this.grid[row].length; col++) {
              console.log(this.grid[row][col]);
          }
      }
  },

  drawArena() {
      context.strokestyle = 'rgba(255, 0, 0, 1)';
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(100, canvas.height / 2);
      context.lineTo(300, canvas.height / 2);
      context.stroke();
  },

    render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.drawArena();
        context.fill();
    },
  }

  return gameModel;
}

