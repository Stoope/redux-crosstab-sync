var lastTimeStamp = 0;

function timestampAction(action) {
  var stampedAction = action;
  stampedAction.$time = Date.now();
  return {
    stampedAction: stampedAction
  };
}

function createActionStorageMiddlewareWithConfig(config) {
  return function() {
    return actionStorageMiddleware(config);
  };
}

function actionStorageMiddleware(config) {
  return function(next) {
    return function(action) {
      if (
        action &&
        !action.$time &&
        checkAllowedActionType(config, action.type)
      ) {
        try {
          var stampedAction = timestampAction(action);
          lastTimeStamp = stampedAction.$time;
          localStorage.setItem("LAST_ACTION", JSON.stringify(stampedAction));
        } catch (e) {}
      }
      return next(action);
    };
  };
}

function checkAllowedActionType(config, type) {
  if (config == null) {
    return true;
  }
  var exclude = config.exclude;
  var include = config.include;
  if (exclude) {
    return !exclude.includes(type);
  } else if (include) {
    return include.includes(type);
  }
}
function createStorageListener(store, config) {
  window.addEventListener("storage", function(event) {
    try {
      var _ref = JSON.parse(event.newValue) || {},
        stampedAction = _ref.stampedAction;

      if (
        stampedAction &&
        stampedAction.$time !== lastTimeStamp &&
        checkAllowedActionType(config, stampedAction.type)
      ) {
        lastTimeStamp = stampedAction.$time;
        store.dispatch(stampedAction);
      }
    } catch (e) {}
  });
}

module.exports = {
  actionStorageMiddleware: actionStorageMiddleware,
  createActionStorageMiddlewareWithConfig: createActionStorageMiddlewareWithConfig,
  createStorageListener: createStorageListener
};
