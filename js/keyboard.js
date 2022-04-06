const Keyboard = () => {
  let input = {
    pressedKeys: {},
    handlers: {},
    keyToAction: {},
    actionToKey: {},
  };

  window.addEventListener('keydown', (e) => {
    input.pressedKeys[e.key] = e.timeStamp;
  })

  window.addEventListener('keyup', (e) => {
    delete input.pressedKeys[e.key]
  })

  input.registerKey = (key, onDown, action) => {
    console.log('registering ' + key + ' key for ' + action + ' action');
    input.handlers[action] = onDown;
    input.keyToAction[key] = action;
    input.actionToKey[action] = key;
  }

  input.unRegisterKey = (action) => {
    if (input.actionToKey.hasOwnProperty(action)) {
      console.log('deleting key for ' + action)
      const key = input.actionToKey[action];
      delete input.handlers[action]
      delete input.actionToKey[action]
      delete input.keyToAction[key]
    }
  }

  input.processInput = (elapsed) => {
    for (let key in input.pressedKeys) {
      if (input.keyToAction.hasOwnProperty(key)) {
        let action = input.keyToAction[key];
        if (input.handlers.hasOwnProperty(action)) {
          input.handlers[action](elapsed);
        }
      }
    }
  }
  return input;
};
