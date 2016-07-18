import isNumber from 'lodash.isnumber';

export const listWith = updater => state =>
  state.reduce((acc, item, index) => ({
    ...acc,
    [index]: updater,
  }), {});

export const wrap = (dispatch, key, index) => action => {
  const meta = { originalType: action.type, key };
  if (typeof index !== 'undefined') {
    meta.index = index;
  }

  const type = [key, index, action.type].filter(x => x).reduce(
    (acc, curr) => `${acc}.${curr}`
  );

  dispatch({ ...action, meta, type });
};

const unwrap = (action, originalType) => ({
  ...action,
  type: originalType,
  meta: {},
});

export default (initialModel, updaters) => (state = initialModel, action) => {
  const { meta } = action;
  if (!meta) {
    // Just a plain ol' action
    const updater = updaters[action.type];
    return updater ? updater(state, action) : state;
  }

  const { originalType, key, index } = meta;

  // Parent forwarding to a dynamic child
  if (key && isNumber(index)) {
    const keyStateSlice = state[key];
    const keyUpdater = updaters[key];

    if (typeof keyStateSlice === 'undefined' || !keyUpdater) {
      return state;
    }

    const stateSlice = keyStateSlice[index];
    const updater = keyUpdater(keyStateSlice)[index];

    if (typeof stateSlice === 'undefined' || !updater) {
      return state;
    }

    const unwrappedAction = unwrap(action, originalType);

    const updatedList = keyStateSlice.slice(0, index)
      .concat(updater(stateSlice, unwrappedAction))
      .concat(keyStateSlice.slice(index + 1));

    // return state;
    return {
      ...state,
      [key]: updatedList,
    };
  }

  // Parent forwarding to a single child
  if (key) {
    const stateSlice = state[key];
    const updater = updaters[key];

    if (typeof stateSlice === 'undefined' || !updater) {
      return state;
    }

    const unwrappedAction = unwrap(action, originalType);
    return {
      ...state,
      [key]: updater(stateSlice, unwrappedAction),
    };
  }

  // Child running its own updaters
  // Don't unwrap the action
  const updater = updaters[action.type];
  return updater ? updater(state, action) : state;
};
