const Keyboard = () => {
  let input = {
    pressedKeys: {},
    handlers: {},
    alreadyExecuted: {},
    keyToAction: {},
    actionToKey: {},
    mouseDown : [],
    mouseUp : [],
    mouseMove : [],
    handlersDown : [],
    handlersUp : [],
    handlersMove : []
  };

  window.addEventListener('keydown', (e) => {
    input.pressedKeys[e.key] = e.timeStamp;
  })

  window.addEventListener('keyup', (e) => {
    input.alreadyExecuted[input.keyToAction[e.key]] = false;
    delete input.pressedKeys[e.key]
  })

  input.registerKey = (key, onDown, action) => {
    console.log('registering ' + key + ' key for ' + action + ' action');
    input.handlers[action] = onDown;
    input.keyToAction[key] = action;
    input.actionToKey[action] = key;
    input.alreadyExecuted[action] = false;
    localStorage[action] = key;
  }

  input.unRegisterKey = (action) => {
    if (input.actionToKey.hasOwnProperty(action)) {
      console.log('deleting key for ' + action)
      const key = input.actionToKey[action];
      delete input.handlers[action];
      delete input.actionToKey[action];
      delete input.keyToAction[key];
      delete input.alreadyExecuted[action];
    }
  }

  input.register = (type, handler) => {
    if (type === 'mousedown') {
      input.handlersDown.push(handler);
    }
    else if (type === 'mouseup') {
      input.handlersUp.push(handler);
    }
    else if (type === 'mousemove') {
      input.handlersMove.push(handler);
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    input.mouseDown.push(e);
  });
  canvas.addEventListener('mouseup', (e) => {
    input.mouseUp.push(e);
  });
  canvas.addEventListener('mousemove', (e) => {
    input.mouseMove.push(e);
  });

  input.processInput = (elapsed) => {
    for (let key in input.pressedKeys) {
      if (input.keyToAction.hasOwnProperty(key)) {
        let action = input.keyToAction[key];
        if (input.handlers.hasOwnProperty(action) && !input.alreadyExecuted[action]) {
          input.handlers[action](elapsed);
          input.alreadyExecuted[action] = true;
        }
      }
    }
    // Mouse input code from class
    // Process the mouse events for each of the different kinds of handlers
    for (let event = 0; event < input.mouseDown.length; event++) {
      for (let handler = 0; handler < input.handlersDown.length; handler++) {
        input.handlersDown[handler](input.mouseDown[event], elapsed);
      }
    }
    for (let event = 0; event < input.mouseUp.length; event++) {
      for (let handler = 0; handler < input.handlersUp.length; handler++) {
        input.handlersUp[handler](input.mouseUp[event], elapsed);
      }
    }
    for (let event = 0; event < input.mouseMove.length; event++) {
      for (let handler = 0; handler < input.handlersMove.length; handler++) {
        input.handlersMove[handler](input.mouseMove[event], elapsed);
      }
    }
    // Now that we have processed all the inputs, reset everything back to the empty state
    input.mouseDown.length = 0;
    input.mouseUp.length = 0;
    input.mouseMove.length = 0;
  };

  return input;
};
