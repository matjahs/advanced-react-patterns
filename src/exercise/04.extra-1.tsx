// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.extra-1.js

import * as React from "react";
import {Switch} from "../switch";

interface UseToggle {
  on: boolean;
  toggle: () => void;
  togglerProps: TogglerProps;
  getTogglerProps: (props: TogglerProps) => TogglerProps;
}

interface TogglerProps {
  "aria-pressed"?: boolean;
  onClick?: () => void;
  [key: string]: unknown;
}

function callAll(...fns: (Function | undefined)[]) {
  return function (...args: any[]) {
    fns.forEach(fn => {
      fn && fn(...args);
    });
  };
}

function useToggle(): UseToggle {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn(!on);

  const togglerProps: TogglerProps = {
    on,
    toggle,
    "aria-pressed": on,
    onClick: toggle,
  };
  const getTogglerProps = ({onClick, ...props}: TogglerProps): TogglerProps => {
    return {
      onClick: callAll(onClick, toggle),
      ...props,
    };
  };

  return {on, toggle, togglerProps, getTogglerProps};
}

function App() {
  const {on, getTogglerProps} = useToggle();
  return (
    <div>
      <Switch {...getTogglerProps({on})} />
      <hr />
      <button
        {...getTogglerProps({
          "aria-label": "custom-button",
          onClick: () => console.info("onButtonClick"),
          id: "custom-button-id",
        })}
      >
        {on ? "on" : "off"}
      </button>
    </div>
  );
}

export default App;

/*
eslint
  no-unused-vars: "off",
*/
