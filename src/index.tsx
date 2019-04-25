import * as React from "react";
import { render } from "react-dom";
import SnakeGame from "./SnakeGame";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>Snake</h1>
      <SnakeGame size={20} />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
