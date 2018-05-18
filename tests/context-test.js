import 'jest';
import React from 'react';
import Microstates, { Consumer } from '../src';
import { mount } from 'enzyme';

it('exports Consumer component', () => {
  expect(Consumer).toBeInstanceOf(Function);
});

let wrap = ({ children, ...rest }) => mount(<Microstates {...rest}>{children}</Microstates>);

let ConsumerChild = ({ selector, result, children }) => <div data-selector={selector}>{result.state}</div>;

describe('single consumer', function() {
  let children = next => (
    <div>
      <ConsumerChild result={next} />
    </div>
  );

  let wrapper = wrap({
    Type: Number,
    children: (
      <Microstates Type={Number}>
        <div>
          <Consumer>{children}</Consumer>
        </div>
      </Microstates>
    )
  });

  it('sends state and actions to children', () => {
    let number = wrap({ Type: Number, children })
      .find(ConsumerChild)
      .props().result;

    expect(number.state).toBe(0);
    expect(number.increment).toBeInstanceOf(Function);
  });
});

let findConsumerState = (wrapper, selector) =>
  wrapper
    .find(ConsumerChild)
    .findWhere(x => x.props().selector === selector)
    .props().result;

describe('many consumers', () => {
  let c1 = next => (
    <div>
      <ConsumerChild selector="c1" result={next} />
    </div>
  );

  let c2 = next => (
    <div>
      <ConsumerChild selector="c2" result={next} />
    </div>
  );

  let wrapper = wrap({
    Type: Number,
    value: 42,
    children: (
      <>
        <div>
          <Consumer>{c1}</Consumer>
        </div>
        <div>
          <Consumer>{c2}</Consumer>
        </div>
      </>
    )
  });

  it('sends state to both subscribers', () => {
    let c1 = findConsumerState(wrapper, 'c1');
    expect(c1.state).toBe(42);
    expect(c1.increment).toBeInstanceOf(Function);

    let c2 = findConsumerState(wrapper, 'c2');
    expect(c2.state).toBe(42);
    expect(c2.increment).toBeInstanceOf(Function);
  });
});

describe('many providers', () => {
  let c1 = next => (
    <div>
      <ConsumerChild selector="c1" result={next} />
    </div>
  );

  let c2 = next => (
    <div>
      <ConsumerChild selector="c2" result={next} />
    </div>
  );

  let wrapper = mount(
    <div>
      <Microstates Type={Number} value={42}>
        <div>
          <Consumer>{c1}</Consumer>
        </div>
      </Microstates>
      <Microstates Type={String} value="hello world">
        <div>
          <Consumer>{c2}</Consumer>
        </div>
      </Microstates>
    </div>
  );

  it('sends state to both subscribers', () => {
    let c1 = findConsumerState(wrapper, 'c1');
    expect(c1.state).toBe(42);
    expect(c1.increment).toBeInstanceOf(Function);

    let c2 = findConsumerState(wrapper, 'c2');
    expect(c2.state).toBe('hello world');
    expect(c2.concat).toBeInstanceOf(Function);
  });
});

describe('many providers', () => {
  let c1 = next => (
    <div>
      <ConsumerChild selector="c1" result={next} />
    </div>
  );

  let c2 = next => (
    <div>
      <ConsumerChild selector="c2" result={next} />
    </div>
  );

  let wrapper = mount(
    <div>
      <Microstates Type={Number} value={42}>
        <div>
          <Consumer>{c1}</Consumer>
        </div>
      </Microstates>
      <Microstates Type={String} value="hello world">
        <div>
          <Consumer>{c2}</Consumer>
        </div>
      </Microstates>
    </div>
  );

  beforeEach(() => {
    findConsumerState(wrapper, 'c1').increment();
    findConsumerState(wrapper, 'c2').concat('!!!');
    wrapper.update();
  });

  it('sends next state to both subscribers', () => {
    let c1 = findConsumerState(wrapper, 'c1');
    expect(c1.state).toBe(43);
    expect(c1.increment).toBeInstanceOf(Function);

    let c2 = findConsumerState(wrapper, 'c2');
    expect(c2.state).toBe('hello world!!!');
    expect(c2.concat).toBeInstanceOf(Function);
  });
});

describe('state when children change', function() {
  class Modal {
    isOpen = Boolean;
  }

  let Container = ({ modal }) => (
    <div>
      {modal.state.isOpen ? <div className="modal">Hello World!</div> : null}
      <button onClick={() => modal.isOpen.toggle()}>{modal.state.isOpen ? 'Close' : 'Open'}</button>
    </div>
  );

  let wrapper = mount(
    <Microstates Type={Modal} value={{ isOpen: true }}>
      <div>
        <Consumer>{modal => <Container modal={modal} />}</Consumer>
      </div>
    </Microstates>
  );

  it('has mounted', function() {
    expect(wrapper.find(Container).exists()).toBe(true);
  });

  it('has modal', function() {
    expect(wrapper.find('.modal').exists()).toBe(true);
  });

  it('has button with Close', function() {
    expect(wrapper.find('button').text()).toBe('Close');
  });

  describe('hiding the modal', function() {
    it('hides the modal and changes button text', () => {
      expect(wrapper.find('button').text()).toBe('Close'); // precondition

      wrapper.find('button').simulate('click');

      expect(wrapper.find('.modal')).toHaveLength(0);
      expect(wrapper.find('button').text()).toBe('Open');
    });
  });
});
