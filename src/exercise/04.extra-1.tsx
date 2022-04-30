// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from "react";
import {Switch} from "../switch";

interface UseToggle {
  on: boolean;
  toggle: () => void;
  getTogglerProps: GetTogglerProps;
}

interface TogglerProps extends Partial<UseToggle> {
  "aria-pressed": boolean;
  onClick: () => void;
}

type GetTogglerProps = (props?: Record<string, unknown>) => TogglerProps;

function useToggle(): UseToggle {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn(!on);

  const togglerProps: TogglerProps = {
    on,
    toggle,
    "aria-pressed": on,
    onClick: toggle,
  };
  const getTogglerProps: GetTogglerProps = props => ({
    ...togglerProps,
    ...props,
  });

  return {on, toggle, getTogglerProps};
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
