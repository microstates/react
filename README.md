# @microstates/react

[![Build Status](https://travis-ci.org/microstates/react.svg?branch=master)](https://travis-ci.org/microstates/react)

This package provides `useType` hook for React that supports `useState` hook. 

*If your version of React doesn't have `useState`, don't install this package. Go to [Microstates with React Class Components](#microstates-with-react-class-components) section.*

## Installation

```bash
npm install --save @microstates/react

# or

yarn add @microstates/react
```

## Usage

`useType` takes the same arguements as Microstates `create` but it provides you with a microstate
that will re-render the component on every transition.

```jsx
function App() {
  let number = useType(Number, 42);

  return (
    <>
      <span>{number.state}</span>
      <button onClick={() => number.increment()}>Increment</button>
    </>
  );
}
```

## Microstates with React Class Components

It's easier to setup Microstates with React Class Component than to install a package 
that provides a component that does this. Here is how it's done.

```jsx
import React from 'react';
import { create, Store } from 'microstates';

let initial = create(Number, 42);

class App extends React.Component {
  // this function will be invoked when transition is called
  // it will receive the next microstate. Set it onto your state.
  update = $ => this.setState({ $ });

  state = {
    // I'm using $ cause I'm bling like that, 
    // but you can use anything you want
    $: Store(initial, this.update)
  }

  render() {
    return this.state.$.state;
  } 
}
```

That's it.
