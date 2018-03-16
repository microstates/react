import 'jest';
import React, { Component } from 'react';
import Microstates from '../src';
import { create } from 'microstates';
import { mount } from 'enzyme';

describe('children invocation', () => {
  let Result = props => <div>{props.result.state}</div>;

  let children = next => <Result result={next} />;

  let wrap = props => mount(<Microstates {...props} />);

  describe('render without value', () => {
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

  describe('children invocation with value', () => {
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

  let Container = ({ modal }) => (
    <div>
      {modal.state.isOpen ? <div className="modal">Hello World!</div> : null}
      <button onClick={() => modal.isOpen.toggle()}>{modal.state.isOpen ? 'Close' : 'Open'}</button>
    </div>
  );

  describe('state when children change', () => {
    class Modal {
      isOpen = Boolean;
    }

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

  describe('supports typeshifting from create', () => {
    class MUAHAHA {
      isOpen = Boolean;

      static create(value) {
        if (!value) {
          return create(MUAHAHA, { isOpen: true });
        }
      }
    }

    let wrap = () =>
      mount(
        <Microstates Type={MUAHAHA}>
          {modal => <Container modal={modal} />}
        </Microstates>
      );

    let wrapper = wrap();

    it('has modal', () => {
      expect(wrapper.find('.modal').exists()).toBe(true);
    });
  });
});
