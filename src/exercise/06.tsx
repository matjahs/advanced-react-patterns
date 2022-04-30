// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from "react";
import warning from "warning";
import {Switch} from "../switch";

const callAll =
  (...fns: any[]) =>
  (...args: any[]) =>
    fns.forEach(fn => fn?.(...args));

const actionTypes = {
  toggle: "toggle",
  reset: "reset",
};

function toggleReducer(state: State, {type, initialState}: any): State {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on};
    }
    case actionTypes.reset: {
      return initialState;
    }
    default: {
      throw new Error(`Unsupported type: ${type}`);
    }
  }
}

interface State {
  on: any;
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
  readOnly = false,
}: any = {}) {
  const {current: initialState} = React.useRef({on: initialOn});
  const [state, dispatch] = React.useReducer<typeof toggleReducer>(
    reducer,
    initialState,
  );

  const onIsControlled = controlledOn != null;
  const on = onIsControlled ? controlledOn : state.on;

  const hasOnChange = Boolean(onChange);
  React.useEffect(() => {
    warning(
      !(!hasOnChange && onIsControlled && !readOnly),
      `Warning: Failed prop type: You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field. If the field should be mutable use \`defaultValue\`. Otherwise, set either \`onChange\` or \`readOnly\`.`,
    );
  }, [hasOnChange, onIsControlled, readOnly]);

  function dispatchWithOnChange(action: any) {
    if (!onIsControlled) {
      dispatch(action);
    }
    onChange?.(reducer({...state, on}, action), action);
  }

  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle});
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState});

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

function Toggle({on: controlledOn, onChange, readOnly = false}: any) {
  const {on, getTogglerProps} = useToggle({
    on: controlledOn,
    onChange,
    readOnly,
  });
  const props = getTogglerProps({on});
  return <Switch {...props} />;
}

function App() {
  const [bothOn, setBothOn] = React.useState(false);
  const [timesClicked, setTimesClicked] = React.useState(0);

  function handleToggleChange(state: any, action: any) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return;
    }
    setBothOn(state.on);
    setTimesClicked(c => c + 1);
  }

  function handleResetClick() {
    setBothOn(false);
    setTimesClicked(0);
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args: any[]) =>
            console.info("Uncontrolled Toggle onChange", ...args)
          }
        />
      </div>
    </div>
  );
}

export default App;
// we're adding the Toggle export for tests
export {Toggle};

/*
eslint
  no-unused-vars: "off",
*/
