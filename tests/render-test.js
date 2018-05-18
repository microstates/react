import 'jest';
import React from 'react';
import Microstates, { Consumer } from '../src';
import { mount } from 'enzyme';

let Result = props => <div>{props.result.state}</div>;

let render = next => <Result result={next} />;

let wrap = props => mount(<Microstates {...props} />);

describe('render without value', () => {
  it('sends state and actions to children', () => {
    let number = wrap({ render, Type: Number })
      .find(Result)
      .props().result;

    expect(number.state).toBe(0);
    expect(number.increment).toBeInstanceOf(Function);
  });
});

describe('children invocation with value', () => {
  it('sends state and actions to children', () => {
    let number = wrap({ render, Type: Number, value: 42 })
      .find(Result)
      .props().result;

    expect(number.state).toBe(42);
    expect(number.increment).toBeInstanceOf(Function);
  });
});

describe('using type instead of Type', () => {
  it('can use type argument instead of Type', () => {
    let wrapper = wrap({ render, type: Number, value: 42 });

    expect(wrapper.text()).toBe('42');
  });
});

describe('context', () => {
  it('can use type argument instead of Type', () => {
    let Counter = () => {
      return (
        <Consumer>
          {m => {
            return m.state;
          }}
        </Consumer>
      );
    };

    let props = { type: Number, value: 42, render: () => <Counter /> };
    let wrapper = wrap(props);

    expect(wrapper.text()).toBe('42');
  });
});

describe('onChange invocation', () => {
  it('sent next value to onChange', () => {
    let onChange = jest.fn();

    let wrapper = wrap({
      type: Number,
      value: 42,
      onChange,
      render: m => (
        <button
          onClick={() => {
            m.increment();
          }}
        >
          Increment
        </button>
      )
    });

    wrapper.find('button').simulate('click');

    expect(onChange).toHaveBeenCalledWith(43);
  });
});
