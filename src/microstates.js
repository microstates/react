import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Observable } from "rxjs";
import { create } from "microstates";
import createReactContext from 'create-react-context';

const Context = createReactContext(null);

export const { Consumer } = Context;
export default class Microstates extends PureComponent {

  static propTypes = {
    Type: PropTypes.func,
    type: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    render: PropTypes.func,
    value: PropTypes.any
  };

  static defaultProps = {
    children: null
  };

  constructor(props = {}) {
    super(props);

    let { Type, type, children, value } = props;

    Type = Type || type;

    if (!Type) {
      let name = this.displayName || this.name || Microstates.name;
      console.error(`${name} expects Type prop to be specified but none was received.`);
      return;
    }

    let microstate = create(Type, value);
    let observable = Observable.from(microstate);

    this.subscription = observable.subscribe(this.onNext);
  }

  onNext = next => {
    if (this.state) {
      this.setState({ next });
    } else {
      this.state = { next };
    }
  };

  render() {
    let { children, render } = this.props;

    let value = this.state && this.state.next;

    if (render && render.call) {
      return (
        <Context.Provider value={value}>
          {render(value)}
        </Context.Provider>
      )
    }
    
    return (
      <Context.Provider value={value}>
        {children && children.call ? children(value) : children}
      </Context.Provider>
    );
  }
}
