"use strict";

var lastTimeStamp = 0;

var timestampAction = function timestampAction(action) {
  var stampedAction = action;
  stampedAction.$time = Date.now();
  return {
    stampedAction: stampedAction
  };
};

var createActionStorageMiddlewareWithConfig = function createActionStorageMiddlewareWithConfig(
  config
) {
  return function actionStorageMiddleware() {
    return actionStorageMiddleware(config);
  };
};

var actionStorageMiddleware = function actionStorageMiddleware(config) {
  return function(next) {
    return function(action) {
      if (action && !action.$time) {
        if (
          config == null ||
          config.include == null ||
          config.include.includes(action.type)
        ) {
          try {
            var stampedAction = timestampAction(action);
            lastTimeStamp = stampedAction.$time;
            localStorage.setItem("LAST_ACTION", JSON.stringify(stampedAction));
          } catch (e) {}
        }
      }
      return next(action);
    };
  };
};

var createStorageListener = function createStorageListener(store) {
  var config =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var exclude = config.exclude;
  var include = config.include;

  var checkActionType = function checkActionType() {
    return false;
  };

  if (exclude) {
    checkActionType = function checkActionType(type) {
      return !exclude.includes(type);
    };
  } else if (include) {
    checkActionType = function checkActionType(type) {
      return include.includes(type);
    };
  }

  window.addEventListener("storage", function(event) {
    try {
      var _ref = JSON.parse(event.newValue) || {},
        stampedAction = _ref.stampedAction;

      if (
        stampedAction &&
        stampedAction.$time !== lastTimeStamp &&
        checkActionType(stampedAction.type)
      ) {
        lastTimeStamp = stampedAction.$time;
        store.dispatch(stampedAction);
      }
    } catch (e) {}
  });
};

module.exports = {
  actionStorageMiddleware: actionStorageMiddleware,
  createStorageListener: createStorageListener
};
