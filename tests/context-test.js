import 'jest';
import React from 'react';
import Microstates, { Consumer } from '../src';
import { mount } from '../setupTests';

it('it exports Consumer component', () => {
  expect(Consumer).toBeInstanceOf(Function);
});

describe('single consumer', function() {
  let state;

  const children = next => {
    state = next;
    return null;
  };

  mount(
    <Microstates Type={Number}>
      <div>
        <Consumer>{children}</Consumer>
      </div>
    </Microstates>
  );

  it('sends state and actions to children', () => {
    expect(state).toMatchObject({
      increment: expect.any(Function),
      state: 0
    });
  });
});

describe('many consumers', function() {
  let s1, s2;

  const c1 = next => {
    s1 = next;
    return null;
  };

  const c2 = next => {
    s2 = next;
    return null;
  };

  mount(
    <Microstates Type={Number} value={42}>
      <div>
        <Consumer>{c1}</Consumer>
      </div>
      <div>
        <Consumer>{c2}</Consumer>
      </div>
    </Microstates>
  );

  it('sends state to both subscribers', () => {
    expect(s1).toMatchObject({
      increment: expect.any(Function),
      state: 42
    });
    expect(s2).toMatchObject({
      increment: expect.any(Function),
      state: 42
    });
  });
});

describe('many providers', () => {
  let s1, s2;

  const c1 = next => {
    s1 = next;
    return null;
  };

  const c2 = next => {
    s2 = next;
    return null;
  };

  mount(
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
    expect(s1).toMatchObject({
      increment: expect.any(Function),
      state: 42
    });
    expect(s2).toMatchObject({
      concat: expect.any(Function),
      state: 'hello world'
    });
  });
});

describe('many providers', () => {
  let s1, s2;

  const c1 = next => {
    s1 = next;
    return null;
  };

  const c2 = next => {
    s2 = next;
    return null;
  };

  mount(
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
    s1.increment();
    s2.concat('!!!');
  });

  it('sends next state to both subscribers', () => {
    expect(s1).toMatchObject({
      increment: expect.any(Function),
      state: 43
    });
    expect(s2).toMatchObject({
      concat: expect.any(Function),
      state: 'hello world!!!'
    });
  });
});

describe('state when children change', function() {
  let component = {};
  class Modal {
    isOpen = Boolean;
  }
  mount(
    <Microstates Type={Modal} value={{ isOpen: true }}>
      <div>
        <Consumer>
          {modal => {
            return (
              <div>
                {modal.state.isOpen ? <div className="modal">Hello World!</div> : null}
                <button onClick={() => modal.isOpen.toggle()}>{modal.state.isOpen ? 'Close' : 'Open'}</button>
              </div>
            );
          }}
        </Consumer>
      </div>
    </Microstates>,
    component
  );

  it('has mounted', function() {
    expect(component.mounted).not.toBeUndefined();
  });

  it('has modal', function() {
    expect(component.mounted.find('.modal').exists()).toBe(true);
  });

  it('has button with Close', function() {
    expect(component.mounted.find('button').text()).toBe('Close');
  });

  describe('hiding the modal', function() {
    beforeEach(() => {
      component.mounted.find('button').simulate('click');
    });

    it('hides the modal', function() {
      expect(component.mounted.find('.modal').exists()).toBe(false);
    });

    it('has button with Open', function() {
      expect(component.mounted.find('button').text()).toBe('Open');
    });
  });
});
