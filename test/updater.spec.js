import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { wrap } from '../src';
import { init, updater, ADD } from './util/counter-container';
import { INCREMENT, DECREMENT } from './util/counter';

chai.use(sinonChai);

describe('createUpdater', () => {
  const state = init();

  it('vends plain actions to the correct reducer key', () => {
    const action = { type: ADD };
    const result = updater(state, action);
    expect(result).to.deep.equal({
      topCounter: 0,
      bottomCounter: 0,
      counterList: [0, 0, 0, 0, 0, 0],
    });
  });

  it('vends wrapped actions to the correct reducer key', () => {
    const action = {
      meta: {
        originalType: INCREMENT,
        key: 'topCounter',
      },
      type: 'topCounter.INCREMENT',
    };
    const result = updater(state, action);
    expect(result).to.deep.equal({
      topCounter: 1,
      bottomCounter: 0,
      counterList: [0, 0, 0, 0, 0],
    });
  });

  it('does nothing to the state if the unwrapped key does not exist', () => {
    const action = {
      meta: {
        originalType: INCREMENT,
        key: 'bigOlPupper',
      },
      type: 'bigOlPupper.INCREMENT',
    };
    const result = updater(state, action);
    expect(result).to.deep.equal(state);
  });

  it('vends wrapped, indexed actions to the correct child of a reducer key', () => {
    const action = {
      meta: {
        originalType: INCREMENT,
        key: 'counterList',
        index: 2,
      },
      type: 'topCounter.2.INCREMENT',
    };
    const result = updater(state, action);
    expect(result).to.deep.equal({
      topCounter: 0,
      bottomCounter: 0,
      counterList: [0, 0, 1, 0, 0],
    });
  });

  it('does nothing to the state if the unwrapped key for index does not exist', () => {
    const action = {
      meta: {
        originalType: INCREMENT,
        key: 'bigOlPupper',
        index: 1,
      },
      type: 'bigOlPupper.1.INCREMENT',
    };
    const result = updater(state, action);
    expect(result).to.deep.equal(state);
  });

  it('does nothing to the state if the unwrapped index does not exist', () => {
    const action = {
      meta: {
        originalType: INCREMENT,
        key: 'counterList',
        index: 10,
      },
      type: 'counterList.10.INCREMENT',
    };
    const result = updater(state, action);
    expect(result).to.deep.equal(state);
  });
});

describe('wrap', () => {
  it('returns a new dispatch that wraps actions with a key before calling', () => {
    const dispatch = spy();
    wrap(dispatch, 'bottomCounter')({
      type: INCREMENT,
    });

    expect(dispatch).to.have.been.called.once;
    expect(dispatch).to.have.been.calledWith({
      meta: {
        originalType: INCREMENT,
        key: 'bottomCounter',
      },
      type: 'bottomCounter.INCREMENT',
    });
  });

  it('returns a new dispatch that wraps actions with a key and index before calling', () => {
    const dispatch = spy();
    wrap(dispatch, 'bottomCounter', 3)({
      type: DECREMENT,
    });

    expect(dispatch).to.have.been.called.once;
    expect(dispatch).to.have.been.calledWith({
      meta: {
        originalType: DECREMENT,
        key: 'bottomCounter',
        index: 3,
      },
      type: 'bottomCounter.3.DECREMENT',
    });
  });
});
