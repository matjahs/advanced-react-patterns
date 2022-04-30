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

function useControlledSwitchWarning(
  controlPropValue: unknown,
  controlPropName: string,
  componentName: string,
): void {
  const isControlled = controlPropValue != null;
  const {current: wasControlled} = React.useRef(isControlled);

  React.useEffect(() => {
    warning(
      !(isControlled && !wasControlled),
      `\`${componentName}\` is changing from uncontrolled to be controlled. Components should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${controlPropName}\` prop.`,
    );
    warning(
      !(!isControlled && wasControlled),
      `\`${componentName}\` is changing from controlled to be uncontrolled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${controlPropName}\` prop.`,
    );
  }, [isControlled, wasControlled, componentName, controlPropName]);
}

function useOnChangeReadOnlyWarning(
  controlPropName: string,
  controlPropValue: any,
  componentName: string,
  hasOnChange: boolean,
  readOnly: boolean,
  readOnlyProp: string,
  initialValueProp: string,
  onChangeProp: string,
) {
  const isControlled = controlPropValue != null;

  React.useEffect(() => {
    warning(
      !(!hasOnChange && isControlled && !readOnly),
      `A \`${controlPropName}\` prop was provided to \`${componentName}\` without an \`${onChangeProp}\` handler. This will result in a read-only \`${controlPropName}\` value. If you want it to be mutable, use \`${initialValueProp}\`. Otherwise, set either \`${onChangeProp}\` or \`${readOnlyProp}\`.`,
    );
  }, [
    componentName,
    controlPropName,
    hasOnChange,
    initialValueProp,
    isControlled,
    onChangeProp,
    readOnly,
    readOnlyProp,
  ]);
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

  useControlledSwitchWarning(controlledOn, "on", "useToggle");
  useOnChangeReadOnlyWarning(
    controlledOn,
    "on",
    "useToggle",
    Boolean(onChange),
    readOnly,
    "readOnly",
    "initialOn",
    "onChange",
  );

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
