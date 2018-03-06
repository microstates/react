import 'jest';
import React from 'react';
import Microstates, { Consumer } from '../src';
import { mount } from 'enzyme';

const Result = props => <h1>{props.result && props.result.state}</h1>;

const render = next => <Result result={next} />;

const wrap = (props = {}) => mount(<Microstates {...props} />);

describe('render without value', () => {
  it('sends state and actions to children', () => {
    const state = wrap({ render, Type: Number })
      .find(Result)
      .props().result;

    expect(state).toMatchObject({
      increment: expect.any(Function),
      state: 0
    });
  });
});

describe('children invocation with value', function() {
  const state = wrap({ render, Type: Number, value: 42 })
    .find(Result)
    .props().result;

  it('sends state and actions to children', () => {
    expect(state).toMatchObject({
      increment: expect.any(Function),
      state: 42
    });
  });
});

describe('using type instead of Type', () => {
  it('can use type argument instead of Type', () => {
    const wrapper = wrap({ render, type: Number, value: 42 });

    expect(wrapper.find('h1').text()).toBe('42');
  });
});

describe('context', function() {
  let component = {};
  function Counter() {
    return <Consumer>{m => m.state}</Consumer>;
  }
  mount(<Microstates type={Number} value={42} render={() => <Counter />} />, component);
  it('can use type argument instead of Type', () => {
    expect(component.mounted.text()).toBe('42');
  });
});

describe('onChange invocation', () => {
  let onChange = jest.fn();
  let component = {};
  mount(
    <Microstates
      type={Number}
      value={42}
      onChange={onChange}
      render={m => <button onClick={() => m.increment()}>Increment</button>}
    />,
    component
  );
  beforeEach(() => {
    component.mounted.find('button').simulate('click');
  });
  it('sent next value to onChange', function() {
    expect(onChange).toHaveBeenCalledWith(43);
  });
});
