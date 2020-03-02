import React from "react";
import Header from "./components/header/header";

// State Only
import ToDo from "./components/todo/todo.js";
import SettingsContext from "./context/settings";
import Auth from "./auth/auth";
import Login from "./auth/login";

import "./app.scss";

export default class App extends React.Component {
  render() {
    return (
      <>
        <SettingsContext>
          <Header />
          <Login />
          <ToDo />
        </SettingsContext>
      </>
    );
  }
}
