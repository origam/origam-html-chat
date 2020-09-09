import "mobx-react-lite/batchingForReactDom";
import React from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./admin.scss";
import { ChatApp } from "./ChatApp03/componentIntegrations/ChatApp";
import { ChatAppSetup } from "./ChatApp03/componentIntegrations/ChatAppSetup";
import "./index.scss";
import "./spinner.scss";
import * as serviceWorker from "./serviceWorker";
import { config } from "./ChatApp03/config";

config.authToken = sessionStorage.getItem("origamAuthToken");

function Routed() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <Redirect to="/setup" />
        </Route>
        <Route path="/chatroom">
          <ChatApp />
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
    {/*<App3 />*/}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
