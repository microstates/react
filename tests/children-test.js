import 'jest';
import React, { Component } from 'react';
import Microstates from '../src';
import { mount } from 'enzyme';

describe('children invocation', () => {
  let Result = props => <div>{props.result.state}</div>;

  let children = next => <Result result={next} />;

  let wrap = props => mount(<Microstates {...props} />);

  describe('render without value', function() {
    it('sends state and actions to children', () => {
      let state = wrap({ Type: Number, children })
        .find(Result)
        .props().result;

      expect(state).toMatchObject({
        increment: expect.any(Function),
        state: 0
      });
    });
  });

  describe('children invocation with value', function() {
    it('sends state and actions to children', () => {
      let state = wrap({ Type: Number, value: 42, children })
        .find(Result)
        .props().result;

      expect(state).toMatchObject({
        increment: expect.any(Function),
        state: 42
      });
    });
  });

  describe('state when children change', function() {
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

    it('has mounted', function() {
      expect(wrapper.find(Container)).toHaveLength(1);
    });

    it('has modal', function() {
      expect(wrapper.find('.modal')).toHaveLength(1);
    });

    it('has button with Close', function() {
      expect(wrapper.find('button').text()).toBe('Close');
    });

    describe('hiding the modal', function() {
      it('hides the modal and changes button text', function() {
        expect(wrapper.find('button').text()).toBe('Close'); // precondition

        wrapper.find('button').simulate('click');

        expect(wrapper.find('.modal')).toHaveLength(0);
        expect(wrapper.find('button').text()).toBe('Open');
      });
    });
  });
});
