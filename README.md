# redux-crosstab-sync

Library for syncing redux action between all open tabs on the same domain

### How to install

With `npm`

```
npm install --save redux-crosstab-sync
```

or with `yarn`

```
yarn add redux-crosstab-sync
```

### How to use

First add `actionStorageMiddleware` to redux middlewares list

```
import { actionStorageMiddleware } from 'redux-crosstab-sync';

const store = createStore(
  ...,
  applyMiddleware(actionStorageMiddleware)
);
```

then, in any place you want to start listen for actions, call `createStorageListener` with configuredStore and config, or without if you want to listen for all actions

```
const config = {
    include: [
        'ACTION_1',
        'ACTION_2',
        ...
  ],
}
createStorageListener(store, config);
```

config supports `include` and `exclude` properties
