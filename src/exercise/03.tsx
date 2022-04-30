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

function Toggle({children}: any) {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn(!on);

  return (
    <ToggleContext.Provider value={{on, setOn, toggle}}>
      {children}
    </ToggleContext.Provider>
  );
}

function useToggle(): {on: boolean; toggle: () => void} {
  const context = React.useContext(ToggleContext);
  if (!context) {
    throw new Error(`context is empty`);
  }
  const {on, toggle} = context;

  return {on, toggle};
}

function ToggleOn({children}: any) {
  const {on} = useToggle();

  return on ? children : null;
}

function ToggleOff({children}: any) {
  const {on} = useToggle();
  return on ? null : children;
}

function ToggleButton({...props}: any) {
  const {on, toggle} = useToggle();
  return <Switch on={on} onClick={toggle} {...props} />;
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  );
}

export default App;

/*
 eslint
 no-unused-vars: "off",
 */
