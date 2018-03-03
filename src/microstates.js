import { PureComponent } from "react";
import PropTypes from "prop-types";
import { Observable } from "rxjs";
import { create } from "microstates";

export default class Microstates extends PureComponent {

  static propTypes = {
    Type: PropTypes.func.isRequired,
    children: PropTypes.func,
    render: PropTypes.func,
    value: PropTypes.any
  };

  constructor(props = {}) {
    super(props);

    const { Type, children, value } = props;

    if (!Type) {
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

    if (render && render.call && this.state) {
      return render(this.state.next);      
    }

    if (children && children.call && this.state) {
      return children(this.state.next);
    }

    return null;
  }
}
