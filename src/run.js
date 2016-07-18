import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

export default ({
  containerId,
  view,
  updater,
  storeCreator = createStore,
  renderComponent = true,
}) => {
  const store = storeCreator(updater);

  const ViewWithStore = connect(state => ({
    model: state,
  }))(view);

  const element = (
    <Provider store={store}>
      <ViewWithStore />
    </Provider>
  );

  if (renderComponent) {
    render(element, document.getElementById(containerId));
  }

  return { element, store };
};
