import logo from "./logo.svg";
import "./App.css";
import Pozdrav from "./components/Pozdrav";
import Logos from "./components/Logos";
import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  function decrementCount() {
    setCount((prevCount) => prevCount - 1);
  }

  function incrementCount() {
    setCount((prevCount) => prevCount + 1);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Pozdrav ime="Uros" />
        <div>
          <Logos logo="angular.png"></Logos>
          <Logos logo="react.png"></Logos>
        </div>
        <>
          <button onClick={decrementCount}>-</button>
          <span>{count}</span>
          <button onClick={incrementCount}>+</button>
        </>
      </header>
    </div>
  );
}

export default App;
