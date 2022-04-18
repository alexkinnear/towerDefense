
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
        upgrade: document.getElementById('upgrade'),
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
  let {upgrade, sell, nextLevel} = controls.buttons;

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


  let keyIsBeingChanged = false;

  const changeUpgradeKey = (e) => {
    game.keyboard.unRegisterKey('upgrade')
    game.keyboard.registerKey(e.key, game.upgradeSelected, 'upgrade');
    window.removeEventListener('keydown', changeUpgradeKey);
    upgrade.innerHTML = `Upgrade selected tower: ${keyToText(e.key)}`;
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

  upgrade.addEventListener('click', (e) => {
    if (promptForKeyChange(upgrade)) {
      window.addEventListener('keydown', changeUpgradeKey);;
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
  let upgradeKey = 'u';
  let sellKey = 's';
  let nextLevelKey = 'g';
  if (localStorage['upgrade']) {
    upgradeKey = localStorage['upgrade'];
  }
  if (localStorage['sell']) {
    sellKey = localStorage['sell'];
  }
  if (localStorage['nextLevel']) {
    nextLevelKey = localStorage['nextLevel'];
  }

  gameModel.keyboard.registerKey(upgradeKey, gameModel.upgradeSelected, 'upgrade');
  upgrade.innerHTML = `Upgrade selected tower: ${keyToText(upgradeKey)}`;
  gameModel.keyboard.registerKey(sellKey, gameModel.sellSelected, 'sell');
  sell.innerHTML = `Sell selected tower: ${keyToText(sellKey)}`;
  gameModel.keyboard.registerKey(nextLevelKey, gameModel.startNextLevel, 'nextLevelKey');
  nextLevel.innerHTML = `Start the next level: ${keyToText(nextLevelKey)}`;

  // Set up the excape key to exit the game
  const exitGame = () => {
    if (gameModel.isRunning) {
      console.log('exiting gameloop');
      gameModel.isRunning = false;
      setScreen(main.htmlElement);
    }
  }

  gameModel.keyboard.registerKey('Escape', exitGame, 'exit');
  gameModel.keyboard.registerKey('t', toggleGrid, 'toggleGrid');

  // set up mouse listeners
  let mouseCapture = false;
  gameModel.keyboard.register('mousedown', function(e, elapsedTime) {
    mouseCapture = true;
    // myTexture.moveTo({ x : e.clientX - canvas.offsetLeft,
    // y : e.clientY - canvas.offsetTop });
  });
  gameModel.keyboard.register('mouseup', function(e, elapsedTime) {
    // logic for showing tower range and menu on click
    const clickPos = {
      x : (e.clientX - canvas.offsetLeft) * canvas.width / canvas.clientWidth,
      y : (e.clientY - canvas.offsetTop) * canvas.height / canvas.clientHeight
    };
    if (gameModel.activeTowers) {
      gameModel.selectedTower = null;
      for (let tower of gameModel.activeTowers) {
        const xDistSquared = Math.pow(clickPos.x - tower.center.x, 2);
        const yDistSquared = Math.pow(clickPos.y - tower.center.y, 2);
        const dist = Math.sqrt(xDistSquared + yDistSquared);
        if (dist <= tower.size.x / 2) {
          gameModel.selectedTower = tower;
          break;
        }
      }
    }
    // testing particle system creation and duration
    gameModel.explosionParticleSystems.push(
      ParticleSystem({
        center: { x: clickPos.x, y: clickPos.y },
        size: { mean: 10, stdev: 4 },
        speed: { mean: 200, stdev: 40 },
        lifetime: { mean: 0.2, stdev: 0.1 },
        assetName: 'fireParticle',
        duration: 0.2
      }),
    );
    mouseCapture = false;
  });
  gameModel.keyboard.register('mousemove', function(e, elapsedTime) {
    // logic for placing a new tower goes in here

    // if (mouseCapture) {
      
    // }
  });
};
