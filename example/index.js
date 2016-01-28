// ES6 Module + NPM
import React from "react";
import {render} from "react-dom";

// PostCSS support with autoprefixer.
import "normalize.css";

// CSS Module
import style from "./App.css"

// JSX support
class App extends React.Component {
  render() {
    return <span className={style.hello}>hello quickpack</span>;
  }
}

window.onload = () => {
  render(<App/>,document.querySelector("#react-root"));
};

