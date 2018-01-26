let lastTimeStamp = 0;
const LAST_ACTION = "LAST_ACTION";

const timestampAction = action => {
  const stampedAction = action;
  stampedAction.$time = Date.now();
  return {
    stampedAction
  };
};

const actionStorageMiddleware = () => next => action => {
  if (action && !action.$time) {
    try {
      const stampedAction = timestampAction(action);
      lastTimeStamp = stampedAction.$time;
      localStorage.setItem(LAST_ACTION, JSON.stringify(stampedAction));
    } catch (e) {}
  }
  return next(action);
};

const createStorageListener = (store, config = {}) => {
  const exclude = config.exclude;
  const include = config.include;

  let checkActionType = () => false;

  if (exclude) {
    checkActionType = type => !exclude.includes(type);
  } else if (include) {
    checkActionType = type => include.includes(type);
  }

  window.addEventListener("storage", event => {
    try {
      const { stampedAction } = JSON.parse(event.newValue) || {};
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

module.exports = { actionStorageMiddleware, createStorageListener };
