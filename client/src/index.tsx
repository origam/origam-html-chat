import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import "./admin.scss";

import App from "./App";

import * as serviceWorker from "./serviceWorker";
import { AdminApp } from "./AdminApp/integrations/AdminApp";
import { HashRouter as Router, Switch, Route, Link, NavLink, Redirect, useHistory, useParams } from "react-router-dom";
import { ChatAppSetup } from "./ChatAppSetup";

function Routed() {
  return (
    <Router>
      <Switch>
        <Route path="/chatroom">
          <App />
        </Route>
        <Route path="/setup">
          <ChatAppSetup />
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Routed />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
