import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import React from 'react';
import { mount } from 'enzyme';

import { createView } from '../src';

chai.use(sinonChai);

describe('createView', () => {
  it('propagates props and calls dispatch on mount, unmount, and when called in events', () => {
    const dispatchSpy = spy();
    const TestView = createView(({ model, dispatch }) => (
      <button onClick={dispatch({ type: 'AYY' })}>{model}</button>
    ));
    const wrapper = mount(
      <TestView model="ayy lmao" dispatch={dispatchSpy} />
    );
    const button = wrapper.find('button');

    expect(button.node.innerHTML).to.equal('ayy lmao');

    button.simulate('click');

    wrapper.unmount();

    expect(dispatchSpy).to.have.been.calledThrice;
  });
});
