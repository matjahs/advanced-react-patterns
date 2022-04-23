// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from "react";
import {Switch} from "../switch";

function Toggle({children}: React.ComponentProps<any>) {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn(!on);

  return React.Children.map(children, (child: React.ReactElement) => {
    if (allowedTypes.includes(child.type.toString())) {
      return child;
    }
    return React.cloneElement(child, {on, toggle});
  });
}

// Accepts `on` and `children` props and returns `children` if `on` is true
interface ToggleOnProps extends React.ComponentPropsWithoutRef<"div"> {
  on?: boolean;
  toggle?: () => void;
}
const ToggleOn = ({on, children}: ToggleOnProps) =>
  on ? <>{children}</> : null;

// Accepts `on` and `children` props and returns `children` if `on` is false
interface ToggleOffProps extends React.ComponentPropsWithoutRef<"div"> {
  on?: boolean;
  toggle?: () => void;
}
const ToggleOff = ({on, children}: ToggleOffProps) =>
  on ? null : <>{children}</>;

// Accepts `on` and `toggle` props and returns the <Switch /> with those props.
interface ToggleProps extends React.ComponentPropsWithoutRef<"div"> {
  on?: boolean;
  toggle?: () => void;
}
const ToggleButton: React.FC<ToggleProps> = ({on, toggle}: ToggleProps) => (
  <Switch on={on} onClick={toggle} />
);

const allowedTypes = ["ToggleOn", "ToggleOff", "ToggleButton"];

function App() {
  return (
    <React.StrictMode>
      <div>
        {/* @ts-ignore */}
        <Toggle>
          <ToggleOn>The button is on</ToggleOn>
          <ToggleOff>The button is off</ToggleOff>
          <span>Hello</span>
          <ToggleButton />
        </Toggle>
      </div>
    </React.StrictMode>
  );
}

export default App;

/* eslint no-unused-vars: "off" */
