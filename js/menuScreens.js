const keyToText = (key) => {
  switch (key) {
    case ' ':
      return 'Space Bar';
    case 'ArrowUp':
      return 'Up Arrow';
    case 'ArrowDown':
      return 'Down Arrow';
    case 'ArrowLeft':
      return 'Left Arrow';
    case 'ArrowRight':
      return 'Right Arrow';
    default:
      return key
  }
};

const setupMenuButtons = (game) => {

  let {main, gameScreen, highScores, controls, credits} = {
    main: {
      htmlElement: document.getElementById('main-menu'),
      buttons: {
        newGame: document.getElementById('new-game'),
        toHighScores: document.getElementById('high-scores'),
        toControls: document.getElementById('controls'),
        toCredits: document.getElementById('credits'),
      },
    },

    gameScreen: document.getElementById('game-screen'),

    highScores: {
      htmlElement: document.getElementById('high-scores-menu'),
      highScoresList: document.getElementById('high-scores-list'),
      buttons: {
        back: document.getElementById('high-scores-back'),
      },
    },

    controls: {
      htmlElement: document.getElementById('controls-menu'),
      buttons: {
        path1: document.getElementById('path-1'),
        path2: document.getElementById('path-2'),
        path3: document.getElementById('path-3'),
        sell: document.getElementById('sell'),
        nextLevel: document.getElementById('nextLevel'),
        back: document.getElementById('controls-back'),
      }
    },

    credits: {
      htmlElement: document.getElementById('credits-menu'),
      buttons: {
        back: document.getElementById('credits-back'),
      }
    }
  }

  const setScreen = (screenElement) => {
    game.activeScreen.classList.remove('active')
    screenElement.classList.add('active');
    if (screenElement.id === 'game-screen') {
      screenElement.classList.add('active-row');
    }
    game.activeScreen = screenElement;
  }

  // Main menu
  let {newGame, toHighScores, toControls, toCredits} = main.buttons;

  const toScoreString = (score) => {
    return score <= 0 ? '--' : score;
  }

  newGame.addEventListener('click', (e) => {
    console.log("starting new game");
    setScreen(gameScreen);
    gameModel.newGame();
    prevTime = performance.now();
    gameLoop(performance.now());
  });

  toHighScores.addEventListener('click', (e) => {
    setScreen(highScores.htmlElement);
    if (!localStorage['highScores']) {
      localStorage['highScores'] = JSON.stringify([0, 0, 0, 0, 0]);
    }
    console.log('loading high scores');
    let savedScores = JSON.parse(localStorage['highScores']);
    for (let i = 0; i < savedScores.length; i++) {
      highScores.highScoresList.children[i].innerHTML = toScoreString(savedScores[i]);
    }
  });

  toControls.addEventListener('click', (e) => {
    setScreen(controls.htmlElement);
  });

  toCredits.addEventListener('click', (e) => {
    setScreen(credits.htmlElement);
  });

  // High scores menu
  let {back} = highScores.buttons;
  back.addEventListener('click', (e) => {
    setScreen(main.htmlElement);
  });

  // Controls menu
  let {path1, path2, path3, sell, nextLevel} = controls.buttons;

  let keyIsBeingChanged = false;

  const changePath1Key = (e) => {
    game.keyboard.unRegisterKey('path1')
    game.keyboard.registerKey(e.key, game.upgradeSelected1, 'path1');
    window.removeEventListener('keydown', changePath1Key);
    path1.innerHTML = `Upgrade tower (path 1): ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
  };

  const changePath2Key = (e) => {
    game.keyboard.unRegisterKey('path2')
    game.keyboard.registerKey(e.key, game.upgradeSelected2, 'path2');
    window.removeEventListener('keydown', changePath2Key);
    path2.innerHTML = `Upgrade tower (path 2): ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
  };

  const changePath3Key = (e) => {
    game.keyboard.unRegisterKey('path3')
    game.keyboard.registerKey(e.key, game.upgradeSelected3, 'path3');
    window.removeEventListener('keydown', changePath3Key);
    path3.innerHTML = `Upgrade tower (path 3): ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
  };

  const changeSellKey = (e) => {
    game.keyboard.unRegisterKey('sell')
    game.keyboard.registerKey(e.key, game.sellSelected, 'sell');
    window.removeEventListener('keydown', changeSellKey);
    sell.innerHTML = `Sell selected tower: ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
  };

  const changeNextLevelKey = (e) => {
    game.keyboard.unRegisterKey('nextLevel')
    game.keyboard.registerKey(e.key, game.startNextLevel, 'nextLevel');
    window.removeEventListener('keydown', changeNextLevelKey);
    nextLevel.innerHTML = `Start the next level: ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
  };

  const promptForKeyChange = (htmlElement) => {
    if (!keyIsBeingChanged) {
      keyIsBeingChanged = true;
      htmlElement.innerHTML = '[Press new key]';
      htmlElement.blur();
      return true;
    }
    return false;
  }

  path1.addEventListener('click', (e) => {
    if (promptForKeyChange(path1)) {
      window.addEventListener('keydown', changePath1Key);;
    }
  });

  path2.addEventListener('click', (e) => {
    if (promptForKeyChange(path2)) {
      window.addEventListener('keydown', changePath2Key);;
    }
  });

  path3.addEventListener('click', (e) => {
    if (promptForKeyChange(path3)) {
      window.addEventListener('keydown', changePath3Key);;
    }
  });

  sell.addEventListener('click', (e) => {
    if (promptForKeyChange(sell)) {
      window.addEventListener('keydown', changeSellKey);;
    }
  });

  nextLevel.addEventListener('click', (e) => {
    if (promptForKeyChange(nextLevel)) {
      window.addEventListener('keydown', changeNextLevelKey);;
    }
  });

  controls.buttons.back.addEventListener('click', (e) => {
    setScreen(main.htmlElement);
  })

  // Credits
  credits.buttons.back.addEventListener('click', (e) => {
    setScreen(main.htmlElement);
  });

  // load configurable keys, so the controls menu will display the right keys
  let path1Key = '1';
  let path2Key = '2';
  let path3Key = '3';
  let sellKey = 's';
  let nextLevelKey = 'g';
  let musicKey = 'm';
  if (localStorage['path1']) {
    path1Key = localStorage['path1'];
  }
  if (localStorage['path2']) {
    path2Key = localStorage['path2'];
  }
  if (localStorage['path3']) {
    path3Key = localStorage['path3'];
  }
  if (localStorage['sell']) {
    sellKey = localStorage['sell'];
  }
  if (localStorage['nextLevel']) {
    nextLevelKey = localStorage['nextLevel'];
  }

  gameModel.keyboard.registerKey(path1Key, gameModel.upgradeSelected1, 'path1');
  path1.innerHTML = `Upgrade tower (path 1): ${keyToText(path1Key)}`;
  gameModel.keyboard.registerKey(path2Key, gameModel.upgradeSelected2, 'path2');
  path2.innerHTML = `Upgrade tower (path 2): ${keyToText(path2Key)}`;
  gameModel.keyboard.registerKey(path3Key, gameModel.upgradeSelected3, 'path3');
  path3.innerHTML = `Upgrade tower (path 3): ${keyToText(path3Key)}`;
  gameModel.keyboard.registerKey(sellKey, gameModel.sellSelected, 'sell');
  sell.innerHTML = `Sell selected tower: ${keyToText(sellKey)}`;
  gameModel.keyboard.registerKey(nextLevelKey, gameModel.startNextLevel, 'nextLevelKey');
  nextLevel.innerHTML = `Start the next level: ${keyToText(nextLevelKey)}`;
  gameModel.keyboard.registerKey(musicKey, gameModel.toggleMusic, 'toggleMusic');

  // Set up the excape key to exit the game
  const exitGame = () => {
    if (gameModel.isRunning) {
      console.log('exiting gameloop');
      gameModel.playBackgroundMusic = false;
      gameModel.audio.currentTime = 0;
      gameModel.audio.pause();
      gameModel.isRunning = false;
      setScreen(main.htmlElement);
    }
  }

  gameModel.keyboard.registerKey('Escape', exitGame, 'exit');
  gameModel.keyboard.registerKey('t', toggleGrid, 'toggleGrid');

  const mouseCollidesWithRect = (mousePos, sprite) => {
    const halfX = sprite.size.x / 2;
    const halfY = sprite.size.y / 2;
    return (
      mousePos.x > sprite.center.x - halfX &&
      mousePos.x < sprite.center.x + halfX &&
      mousePos.y > sprite.center.y - halfY &&
      mousePos.y < sprite.center.y + halfY
    );
  }

  let clickedUpgradeMenu = false;
  const checkForUpgradeClick = (upgradePath, selectedTowerMenu, clickPos) => {
    const upgradeMenu = selectedTowerMenu.upgradeMenus[upgradePath];
    if (mouseCollidesWithRect(clickPos, upgradeMenu)) {
      clickedUpgradeMenu = true;
      if (upgradeMenu.upgradeButton !== null && mouseCollidesWithRect(clickPos, upgradeMenu.upgradeButton)) {
        gameModel.selectedTower.upgrade(upgradePath);
      }
    }
  }

  const checkForSellButtonClick = (clickPos, {sellButton}) => {
    if (mouseCollidesWithRect(clickPos, sellButton)) {
      gameModel.sellSelected();
    }
  }

  // set up mouse listeners
  let mouseCapture = false;
  gameModel.keyboard.register('mousedown', function(e, elapsedTime) {
    if (gameModel.gameOver) {
      return;
    }
    mouseCapture = true;
    if (gameModel.towerMenu.hovered) {
      // copy the sprite from the menu into placingTower
      const hoveredSprite = gameModel.towerMenu.hovered;
      gameModel.placingTower = {...hoveredSprite, base: {...hoveredSprite.base}};

    }
    // logic for showing tower range and menu on click
    const clickPos = {
      x : (e.clientX - canvas.offsetLeft) * canvas.width / canvas.clientWidth,
      y : (e.clientY - canvas.offsetTop) * canvas.height / canvas.clientHeight
    };
    clickedUpgradeMenu = false;
    if (gameModel.selectedTower) {
      if (gameModel.selectedTower.chosenUpgradePath === null) {
        checkForUpgradeClick(0, gameModel.selectedTowerMenu, clickPos)
        checkForUpgradeClick(1, gameModel.selectedTowerMenu, clickPos)
        checkForUpgradeClick(2, gameModel.selectedTowerMenu, clickPos)
      } else {
        checkForUpgradeClick(gameModel.selectedTower.chosenUpgradePath, gameModel.selectedTowerMenu, clickPos)
      }
      checkForSellButtonClick(clickPos, gameModel.selectedTowerMenu);
    }
    if (!clickedUpgradeMenu) {
      gameModel.selectedTower = null;
    }
    for (let tower of gameModel.activeTowers) {
      // circle mouse collision
      const xDistSquared = Math.pow(clickPos.x - tower.center.x, 2);
      const yDistSquared = Math.pow(clickPos.y - tower.center.y, 2);
      const dist = Math.sqrt(xDistSquared + yDistSquared);
      if (dist <= tower.size.x / 2) {
        gameModel.selectedTower = tower;
        gameModel.selectedTowerMenu = initializeSelectedTowerMenu(tower);
        break;
      }
    }
  });
  gameModel.keyboard.register('mouseup', function(e, elapsedTime) {
    if (gameModel.placingTower) {
      attemptToPlace(gameModel.placingTower);
      gameModel.placingTower = null;
    }
    mouseCapture = false;
    // code to start a particle system, for when we need it
    // gameModel.explosionParticleSystems.push(
    //   ParticleSystem({
    //     center: { x: clickPos.x, y: clickPos.y },
    //     size: { mean: 10, stdev: 4 },
    //     speed: { mean: 200, stdev: 40 },
    //     lifetime: { mean: 0.2, stdev: 0.1 },
    //     assetName: 'fireParticle',
    //     duration: 0.2
    //   }),
    // );
  });

  gameModel.keyboard.register('mousemove', function(e, elapsedTime) {
    if (gameModel.gameOver) {
      return;
    }
    // detect menu hover
    const mousePos = {
      x : (e.clientX - canvas.offsetLeft) * canvas.width / canvas.clientWidth,
      y : (e.clientY - canvas.offsetTop) * canvas.height / canvas.clientHeight
    };
    gameModel.towerMenu.hovered = null;
    for (let towerSprite of gameModel.towerMenu.towerSprites) {
      if (mouseCollidesWithRect(mousePos, towerSprite)) {
        gameModel.towerMenu.hovered = towerSprite;
      }
    }

    // logic for placing a new tower
    if (gameModel.placingTower) {
      let gridPos = convertCanvasLocationToGridPos(mousePos);
      let snappedPos = {};
      if (gridPos.row == -1) {
        snappedPos = {x: -1000, y: -1000}; // off screen
      } else {
        snappedPos = convertGridPosToCanvasLocation(gridPos);
      }
      gameModel.placingTower.base.center = snappedPos;
      gameModel.placingTower.center = snappedPos;
    }
  });
};
