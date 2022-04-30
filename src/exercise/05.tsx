// State Reducer
// http://localhost:3000/isolated/exercise/05.js

import * as React from "react";
import {Switch} from "../switch";

interface State {
  on: boolean;
}

const enum ActionTypes {
  TOGGLE,
  RESET,
}

type Action =
  | {type: ActionTypes.TOGGLE}
  | {type: ActionTypes.RESET; initialState: State};

const callAll =
  (...fns: any[]) =>
  (...args: any[]) =>
    fns.forEach(fn => fn?.(...args));

function toggleReducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.TOGGLE: {
      return {on: !state.on};
    }
    case ActionTypes.RESET: {
      return action.initialState;
    }
    default: {
      // @ts-expect-error type does not exist on never
      throw new Error(`Unsupported type: ${action.type}`);
    }
  }
}

function useToggle({initialOn = false, reducer = toggleReducer} = {}) {
  const {current: initialState} = React.useRef({on: initialOn});
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {on} = state;

  const toggle = () => dispatch({type: ActionTypes.TOGGLE});
  const reset = () => dispatch({type: ActionTypes.RESET, initialState});

  function getTogglerProps({onClick, ...props}: any = {}) {
    return {
      "aria-pressed": on,
      onClick: callAll(onClick, toggle),
      ...props,
    };
  }

  function getResetterProps({onClick, ...props}: any = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    };
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  };
}

function App() {
  const [timesClicked, setTimesClicked] = React.useState(0);
  const clickedTooMuch = timesClicked >= 4;

  function toggleStateReducer(state: any, action: any) {
    if (action.type === ActionTypes.TOGGLE && timesClicked >= 4) {
      return {on: state.on};
    }
    return toggleReducer(state, action);
  }

  const {on, getTogglerProps, getResetterProps} = useToggle({
    // @ts-ignore
    reducer: toggleStateReducer,
  });

  return (
    <div>
      <Switch
        {...getTogglerProps({
          disabled: clickedTooMuch,
          on: on,
          onClick: () => setTimesClicked(count => count + 1),
        })}
      />
      {clickedTooMuch ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      <button {...getResetterProps({onClick: () => setTimesClicked(0)})}>
        Reset
      </button>
    </div>
  );
}

export default App;

/*
eslint
  no-unused-vars: "off",
*/
