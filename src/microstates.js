import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { create, from, Store } from 'microstates';
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

  state = {
    isMounted: false
  }

  constructor({ Type, type, value, onChange }) {
    super(...arguments);

    let microstate;

    if (this.props.hasOwnProperty('from')) {
      microstate = from(this.props.from);
    } else {
      Type = Type || type;

      // TODO: this can go if we only have type and PropTypes.func.isRequired
      if (!Type) {
        let name = this.displayName || this.name || Microstates.name;
        console.error(`${name} expects Type prop to be specified but none was received.`);
        return;
      }

      microstate = create(Type, value);
    }

    this.state = {
      value: Store(microstate, value => {
        if (this.state.isMounted) {
          this.setState({ value });
          onChange(value);
        }
      })
    }
  }

  componentDidMount() {
    this.setState({ isMounted: true });
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
