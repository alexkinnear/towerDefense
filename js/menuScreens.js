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
        up: document.getElementById('up'),
        left: document.getElementById('left'),
        down: document.getElementById('down'),
        right: document.getElementById('right'),
        fire: document.getElementById('fire'),
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
    // game.restart();

    setScreen(gameScreen);
    // game.running = true;
    prevTime = performance.now();
    gameloop(performance.now());
  });

  toHighScores.addEventListener('click', (e) => {
    setScreen(highScores.htmlElement);
    if (localStorage['highScores']) {
      let saved = JSON.parse(localStorage['highScores']);
      //TODO: load high scores from storage
    }
    // for (let i = 0; i < game.state.highScores.length; i++) {
    //   game.menus.highScores.highScoresList.children[i].innerHTML = toScoreString(game.state.highScores[i]);
    // }
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
  let {up, left, down, right, fire} = controls.buttons;

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
        console.log(key);
        return key
    }
  };


  let keyIsBeingChanged = false;

  // TODO: update the keys for what we need for tower defense
  const changeUp = (e) => {
    // game.keyboard.unRegisterKey('up')
    // game.keyboard.registerKey(e.key, game.player.moveUp, 'up');
    // localStorage['up'] = e.key;
    window.removeEventListener('keydown', changeUp);
    up.innerHTML = `Move Up: ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
  };

  const changeLeft = (e) => {
    // game.keyboard.unRegisterKey('left')
    // game.keyboard.registerKey(e.key, game.player.moveLeft, 'left');
    // localStorage['left'] = e.key;
    window.removeEventListener('keydown', changeLeft);
    left.innerHTML = `Move Left: ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
  };

  const changeRight = (e) => {
    // game.keyboard.unRegisterKey('right')
    // game.keyboard.registerKey(e.key, game.player.moveRight, 'right');
    // localStorage['right'] = e.key;
    window.removeEventListener('keydown', changeRight);
    right.innerHTML = `Move Right: ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
  };

  const changeDown = (e) => {
    // game.keyboard.unRegisterKey('down')
    // game.keyboard.registerKey(e.key, game.player.moveDown, 'down');
    // localStorage['down'] = e.key;
    window.removeEventListener('keydown', changeDown);
    down.innerHTML = `Move Down: ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
  };

  const changeFire = (e) => {
    // game.keyboard.unRegisterKey('fire')
    // game.keyboard.registerKey(e.key, game.player.fire, 'fire');
    // localStorage['fire'] = e.key;
    window.removeEventListener('keydown', changeFire);
    fire.innerHTML = `Fire: ${keyToText(e.key)}`;
    keyIsBeingChanged = false;
    console.log("called chante fire")
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

  up.addEventListener('click', (e) => {
    if (promptForKeyChange(up)) {
      window.addEventListener('keydown', changeUp);;
    }
  });

  left.addEventListener('click', (e) => {
    if (promptForKeyChange(left)) {
      window.addEventListener('keydown', changeLeft);
    }
  });

  down.addEventListener('click', (e) => {
    if (promptForKeyChange(down)) {
      window.addEventListener('keydown', changeDown);
    }
  });

  right.addEventListener('click', (e) => {
    if (promptForKeyChange(right)) {
      window.addEventListener('keydown', changeRight);
    }  
  });

  fire.addEventListener('click', (e) => {
    if (promptForKeyChange(fire)) {
      window.addEventListener('keydown', changeFire);
    } 
  });

  controls.buttons.back.addEventListener('click', (e) => {
    setScreen(main.htmlElement);
  })

  // Credits
  credits.buttons.back.addEventListener('click', (e) => {
    setScreen(main.htmlElement);
  });
};
