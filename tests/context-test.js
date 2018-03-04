import "jest";
import React from "react";
import Microstates, { Consumer } from "@microstates/react";
import { mount } from "../setupTests";

it("it exports Consumer component", () => {
  expect(Consumer).toBeInstanceOf(Function);
});

describe("single consumer", function() {
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

  it("sends state and actions to children", () => {
    expect(state).toMatchObject({
      increment: expect.any(Function),
      state: 0
    });
  });
});

describe("many consumers", function() {
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

  it("sends state to both subscribers", () => {
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
