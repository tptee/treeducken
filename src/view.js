import { Component, PropTypes, createElement } from 'react';
import shallowEqual from 'recompose/shallowEqual';

const COMPONENT_DID_MOUNT = '@@treeducken/COMPONENT_DID_MOUNT';
const COMPONENT_WILL_UNMOUNT = '@@treeducken/COMPONENT_WILL_UNMOUNT';

export default ComposedComponent => {
  class TreeduckenView extends Component {
    componentWillMount() {
      this.props.dispatch({ type: COMPONENT_DID_MOUNT });
    }

    // eslint-disable-next-line no-unused-vars
    shouldComponentUpdate({ dispatch, ...nextProps }) {
      return Object.keys(nextProps).some(key =>
        !shallowEqual(this.props[key], nextProps[key])
      );
    }

    componentWillUnmount() {
      this.props.dispatch({ type: COMPONENT_WILL_UNMOUNT });
    }

    render() {
      return createElement(ComposedComponent, this.props);
    }
  }

  TreeduckenView.propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  return TreeduckenView;
};
