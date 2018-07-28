import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { create } from 'microstates';
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

  _firstUpdate = true;

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

    let observable = microstate['@@observable']();

    observable.subscribe(this.onUpdate);
  }

  onUpdate = value => {
    if (this._firstUpdate) {
      this.state = { value };
      this._firstUpdate = false;
    } else {
      this.setState({ value });
      this.props.onChange(value.state);    }
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
