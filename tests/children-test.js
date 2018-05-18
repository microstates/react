import 'jest';
import React, { Component } from 'react';
import Microstates from '../src';
import { mount } from 'enzyme';

describe('children invocation', () => {
  let Result = props => <div>{props.result.state}</div>;

  let children = next => <Result result={next} />;

  let wrap = props => mount(<Microstates {...props} />);

  describe('render without value', () => {
    it('sends state and actions to children', () => {
      let number = wrap({ Type: Number, children })
        .find(Result)
        .props().result;

      expect(number.state).toBe(0);
      expect(number.increment).toBeInstanceOf(Function);
    });
  });

  describe('children invocation with value', () => {
    it('sends state and actions to children', () => {
      let number = wrap({ Type: Number, value: 42, children })
        .find(Result)
        .props().result;

      expect(number.state).toBe(42);
      expect(number.increment).toBeInstanceOf(Function);
    });
  });

  describe('state when children change', () => {
    let component = {};
    class Modal {
      isOpen = Boolean;
    }

    let Container = ({ modal }) => (
      <div>
        {modal.state.isOpen ? <div className="modal">Hello World!</div> : null}
        <button onClick={() => modal.isOpen.toggle()}>{modal.state.isOpen ? 'Close' : 'Open'}</button>
      </div>
    );

    let wrap = () =>
      mount(
        <Microstates Type={Modal} value={{ isOpen: true }}>
          {modal => <Container modal={modal} />}
        </Microstates>
      );

    let wrapper = wrap();

    it('has mounted', () => {
      expect(wrapper.find(Container).exists()).toBe(true);
    });

    it('has modal', () => {
      expect(wrapper.find('.modal').exists()).toBe(true);
    });

    it('has button with Close', () => {
      expect(wrapper.find('button').text()).toBe('Close');
    });

    describe('hiding the modal', () => {
      it('hides the modal and changes button text', () => {
        expect(wrapper.find('button').text()).toBe('Close'); // precondition

        wrapper.find('button').simulate('click');

        expect(wrapper.find('.modal')).toHaveLength(0);
        expect(wrapper.find('button').text()).toBe('Open');
      });
    });
  });
});
