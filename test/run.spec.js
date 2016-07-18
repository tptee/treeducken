import { expect } from 'chai';

import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { run } from '../src';

import { init, updater, view } from './util/counter-container';

describe('run', () => {
  it('creates a store from an updater and wraps a view in a store provider', () => {
    const { element, store } = run({
      updater, view, renderComponent: false,
    });

    const wrapper = mount(element);
    expect(wrapper.find(Provider)).to.have.lengthOf(1);

    expect(store.getState()).to.deep.equal(init());
  });
});
