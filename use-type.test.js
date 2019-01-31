import React from 'react';
import { mount } from '@bigtest/react';
import { Interactor, text, clickable } from '@bigtest/interactor';
import useType from './use-type';

const AppInteractor = Interactor.from({
  text: text('span'),
  clickIncrement: clickable('button')
});

let app = new AppInteractor();

it('renders and transitions microstate', async () => {
  function App() {
    let number = useType(Number, 42);

    return (
      <>
        <span>{number.state}</span>
        <button onClick={() => number.increment()}>Increment</button>
      </>
    );
  }

  await mount(() => <App />);

  expect(app.text).toBe('42');

  await app.clickIncrement();

  expect(app.text).toBe('43');
});

it('defaults to Any when type is not specified', async () => {
  function App() {
    let s = useType();

    return (
      <>
        <span>{`${s.state}`}</span>
        <button onClick={() => s.set('hello world')}>Set message</button>
      </>
    );
  }

  await mount(() => <App />);

  expect(app.text).toBe('undefined');

  await app.clickIncrement();

  expect(app.text).toBe('hello world');
});
