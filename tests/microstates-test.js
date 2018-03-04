import "jest";
import React from "react";
import Microstates from "@microstates/react";
import { mount, stubConsoleError } from '../setupTests';

// it('throws an error when type is not specified', () => {
it("exports Microstates", function() {
  expect(Microstates).toBeInstanceOf(Function);
});

describe("Validation", () => {

  stubConsoleError();
  it("throws an exception when rendered without providing a type", () => {
    expect(() => {
      mount(<Microstates />);
    }).toThrowError(
      /The prop `Type` is marked as required in `Microstates`, but its value is `undefined`/
    );
  });

  it("throws an exception when children is not a function", () => {
    expect(() => {
      mount(
        <Microstates type={Number} render={<div />} />
      );
    }).toThrowError(
      /Failed prop type: Invalid prop `render` of type `object` supplied to `Microstates`, expected `function`/
    );
  });

});
