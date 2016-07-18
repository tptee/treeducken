/* eslint-env browser */
import React from 'react';

import createUpdater from '../src/updater';
import createView from '../src/view';

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const increment = () => ({
  type: INCREMENT,
});

const decrement = () => ({
  type: DECREMENT,
});

export const init = () => 0;

export const updater = createUpdater(init(), {
  [INCREMENT]: (state) => state + 1,
  [DECREMENT]: (state) => state - 1,
});

export const view = createView(({ model, dispatch }) => (
  <div>
    <p>{model}</p>
    <button onClick={() => dispatch(increment())}>
      +
    </button>
    <button onClick={() => dispatch(decrement())}>
      -
    </button>
  </div>
));
