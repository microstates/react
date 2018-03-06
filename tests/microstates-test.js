import 'jest';
import React from 'react';
import Microstates from '../src';
import { stubConsoleError } from '../setupTests';
import { mount as mountComponent } from 'enzyme';

it('exports Microstates', function() {
  expect(Microstates).toBeInstanceOf(Function);
});

describe('Validation', () => {
  stubConsoleError();

  it('throws an exception when rendered without providing a type', () => {
    expect(() => {
      mountComponent(<Microstates />);
    }).toThrowError(/Microstates expects Type prop to be specified but none was received/);
  });

  it('throws an exception when render is not a function', () => {
    expect(() => {
      mountComponent(<Microstates Type={Number} render={<div />} />);
    }).toThrowError(
      /Failed prop type: Invalid prop `render` of type `object` supplied to `Microstates`, expected `function`/
    );
  });
});
