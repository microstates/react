import "jest";
import React, { Component } from "react";
import Microstates from "@microstates/react";
import { mount } from "../setupTests";

describe("children invocation", () => {
  let state;

  const children = next => {
    state = next;
    return null;
  };

  describe("render without value", function() {
    mount(<Microstates Type={Number}>{children}</Microstates>);

    it("sends state and actions to children", () => {
      expect(state).toMatchObject({
        increment: expect.any(Function),
        state: 0
      });
    });
  });

  describe("children invocation with value", function() {
    mount(
      <Microstates Type={Number} value={42}>
        {children}
      </Microstates>
    );

    it("sends state and actions to children", () => {
      expect(state).toMatchObject({
        increment: expect.any(Function),
        state: 42
      });
    });
  });

  describe("state when children change", function() {
    let component = {}
    class Modal {
      isOpen = Boolean;
    }
    mount(
      <Microstates Type={Modal} value={{ isOpen: true }}>
        {modal => {
          return (
            <div>
              {modal.state.isOpen ? (
                <div className="modal">Hello World!</div>
              ) : null}
              <button onClick={() => modal.isOpen.toggle()}>
                {modal.state.isOpen ? "Close" : "Open"}
              </button>
            </div>
          );
        }}
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
});
