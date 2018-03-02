import "jest";
import React from "react";
import Microstates from "@microstates/react";
import { mount } from "../setupTests";

describe("children invocation", () => {
  let state, actions;

  const children = (_state, _actions) => {
    state = _state;
    actions = _actions;
    return null;
  };

  describe("render without value", function() {
    mount(
      <Microstates Type={Number}>
        {children}
      </Microstates>
    );

    it("sends state and actions to children", () => {
      expect(state).toBe(0);
      expect(actions).toMatchObject({
        increment: expect.any(Function)
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
      expect(state).toBe(42);
      expect(actions).toMatchObject({
        increment: expect.any(Function)
      });
    });
  });
});
