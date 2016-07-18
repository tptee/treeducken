import React from 'react';
import { createStore } from 'redux';

import { run, createUpdater, createView, listWith, wrap } from '../src';

import {
  init as counterInit,
  updater as counterUpdater,
  view as CounterView,
} from './counter';

const ADD = 'ADD';
const REMOVE = 'REMOVE';

const init = () => ({
  topCounter: counterInit(),
  bottomCounter: counterInit(),
  counterList: Array.from(Array(5)).map(counterInit),
});

const updater = createUpdater(init(), {
  topCounter: counterUpdater,
  bottomCounter: counterUpdater,
  counterList: listWith(counterUpdater),
  [ADD]: (state) => ({
    ...state, counterList: state.counterList.concat(0),
  }),
  [REMOVE]: (state, action) => {
    const { index } = action;
    const { counterList } = state;
    return {
      ...state,
      counterList: counterList.slice(0, index)
        .concat(counterList.slice(index + 1)),
    };
  },
});

const view = createView(({ model, dispatch }) => (
  <div>
    <h1>Treeducken demo</h1>

    <h2>Pair of counters</h2>
    <CounterView
      model={model.topCounter}
      dispatch={wrap(dispatch, 'topCounter')}
    />
    <CounterView
      model={model.bottomCounter}
      dispatch={wrap(dispatch, 'bottomCounter')}
    />

    <h2>List of counters</h2>
    <button onClick={() => dispatch({ type: ADD })}>
      Add new counter
    </button>
    {model.counterList.map((counter, index) => (
      <div key={index}>
        <CounterView
          model={model.counterList[index]}
          dispatch={wrap(dispatch, 'counterList', index)}
        />
        <button onClick={() => dispatch({ type: REMOVE, index })}>
          Remove this counter
        </button>
      </div>
    ))}
  </div>
));

run({
  containerId: 'content',
  storeCreator: createStore,
  updater,
  view,
});
