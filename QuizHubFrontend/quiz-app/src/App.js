import logo from "./logo.svg";
import "./App.css";
import Pozdrav from "./components/Pozdrav";
import Logos from "./components/Logos";
import Login from "./components/Pages/LoginPage";
import { useState, useEffect } from "react";
import LoginPage from "./components/Pages/LoginPage";
import "./index.css";
import Router from "./components/Router";
import Navbar from "./components/Navbar";
//import { NavbarSimple } from "./components/NavbarTailwind";

function App() {
  return (
    <>
      <Navbar />
      <div className="appContainer">
        <Router />
      </div>
    </>
  );
}

export default App;
