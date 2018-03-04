# @microstates/react

Component for rendering Microstates models in React. Go to [Microstates](https://github.com/cowboyd/microstates.js) repo to learn about Microstates models.

## Installation

```bash
npm install --save @microstates/react
```

or

```bash
yarn add @microstates/react
```

## How to use

This library provides a component that takes a Microstates model type and creates an instance of the given type. The instance will be sent to one the following: `children` function, props `render` function or a context consumer.

### <Microstates type={Type} value={any} render={fn} />

Microstates component takes type and value arguments. Type is a class definition that describes the structure of the data. The component will instantiate this class and provide an instance. The `value` prop is used to provide initial value for the Microstates model. 

### `children` function

```js
import Microstates from "@microstates/react";

function App() {
  return (
    <Microstates type={Number} value={42}>
      {number => {
        return (
          <div>
            <span class="value">{number.state}</span>
            <button onClick={() => number.increment()}>Increment</button>
          </div>
        );
      }}
    </Microstates>
  );
}
```

### props `render` function

If you prefer props `render` function, you can use it same as the `children` function.

```js
import Microstates from "@microstates/react";

function App() {
  return (
    <Microstates
      type={Number}
      value={42}
      render={number => {
        return (
          <div>
            <span class="value">{number.state}</span>
            <button onClick={() => number.increment()}>Increment</button>
          </div>
        );
      }}
    />
  );
}
```

### Context API

`Microstates` component has a Context Provider that is compatible with [React RFCs #2: New Version of Context API](https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md). It is also backwards compatible with pre React 16.3.

To use the context API, import `Consumer` component from `@microstates/react` package.

```js
import Microstates, { Consumer } from "@microstates/react";

class ModalModel {
  content = String;
  isOpen = Boolean;
}

class AppModel {
  modal = ModalModel;
  counter = Number;
}

function Modal() {
  return (
    <Consumer>
      {model => {
        if (model.state.modal.isOpen) {
          return (
            <div className="modal-content">
              {model.state.modal.content}
            </div>
          )
        }
        return null;
      }}
    </Consumer>
  )
}

function App() {
  return (
    <Microstates
      type={AppModel}
      value={{ modal: { content: "Hello World!!!" }, counter: 42 }}
    >
      {model => {
        return (
          <div>
            <button onClick={() => model.modal.isOpen.toggle()}>Toggle Modal</button>
            <Modal>
          </div>
        );
      }}
    </Microstates>
  );
}
```

