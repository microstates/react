import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { create, use } from 'microstates';
import createReactContext from 'create-react-context';

const Context = createReactContext(null);

export const { Consumer } = Context;

export default class Microstates extends PureComponent {
  static propTypes = {
    Type: PropTypes.func,
    type: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    render: PropTypes.func,
    value: PropTypes.any,
    onChange: PropTypes.func
  };

  static defaultProps = {
    onChange: x => x
  };

  constructor(props = {}) {
    super(props);

    let { Type, type, value } = this.props;

    Type = Type || type;

    // TODO: this can go if we only have type and PropTypes.func.isRequired
    if (!Type) {
      let name = this.displayName || this.name || Microstates.name;
      console.error(`${name} expects Type prop to be specified but none was received.`);
      return;
    }

    let microstate = create(Type, value);

    let state = use(this._middleware, microstate);

    this.state = { value: state };
  }

  _middleware = next => (microstate, transition, args) => {
    let value = next(microstate, transition, args);

    this.setState({ value });

    let { onChange } = this.props;

    onChange(value.valueOf());

    return value;
  }
  
  render() {
    let { 
      props: { children, render },
      state: { value }
    } = this;

    if (render && render.call) {
      return <Context.Provider value={value}>{render(value)}</Context.Provider>;
    }

    return <Context.Provider value={value}>{children && children.call ? children(value) : children}</Context.Provider>;
  }
}
