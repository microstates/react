import "jest";
import React from "react";
import Microstates from "@microstates/react";
import { mount } from "../setupTests";

describe("render invocation", () => {
  let state;

  const render = next => {
    state = next;
    return null;
  };

  describe("render without value", function() {
    mount(<Microstates Type={Number} render={render} />);

    it("sends state and actions to children", () => {
      expect(state).toMatchObject({
        increment: expect.any(Function),
        state: 0
      });
    });
  });

  describe("children invocation with value", function() {
    mount(<Microstates Type={Number} value={42} render={render} />);

    it("sends state and actions to children", () => {
      expect(state).toMatchObject({
        increment: expect.any(Function),
        state: 42
      });
    });
  });
});
