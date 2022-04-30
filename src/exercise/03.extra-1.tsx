// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import * as React from "react";
import {Switch} from "../switch";
import {Dispatch, SetStateAction} from "react";

// 🐨 create your ToggleContext context here
// 📜 https://reactjs.org/docs/context.html#reactcreatecontext
interface ToggleContextProps {
  on: boolean;
  setOn: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
}

const ToggleContext = React.createContext<ToggleContextProps | null>(null);
ToggleContext.displayName = "ToggleContext";

function useToggle(): {on: boolean; toggle: () => void} {
  const context = React.useContext(ToggleContext);
  if (!context) {
    throw new Error(`useToggle must be used within a <Toggle></Toggle>`);
  }
  const {on, toggle} = context;

  return {on, toggle};
}

function ToggleButton({...props}: any) {
  const {on, toggle} = useToggle();
  return <Switch on={on} onClick={toggle} {...props} />;
}

const App = () => <ToggleButton />;

export default App;

/*
 eslint
 no-unused-vars: "off",
 */
