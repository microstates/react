import 'jest';
import React from 'react';
import State from '../src';
import { stubConsoleError } from '../setupTests';
import { mount } from 'enzyme';

it('exports Microstates', () => {
  expect(State).toBeInstanceOf(Function);
});

describe('Validation', () => {
  stubConsoleError();

  // TODO: can we delete this?  we should have one type with PropTypes.func.isRequired.
  it('throws an exception when rendered without providing a type', () => {
    expect(() => {
      mount(<State />);
    }).toThrowError(/Microstates expects Type prop to be specified but none was received/);
  });

  it('throws an exception when render is not a function', () => {
    expect(() => {
      mount(<State Type={Number} render={<div />} />);
    }).toThrowError(
      /Failed prop type: Invalid prop `render` of type `object` supplied to `Microstates`, expected `function`/
    );
  });
});
