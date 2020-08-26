import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./admin.scss";
import App from "./App";
import { App as App3 } from "./ChatApp03/componentIntegrations/App";
import { ChatAppSetup } from "./ChatAppSetup";
import "./index.scss";
import "./spinner.scss";
import * as serviceWorker from "./serviceWorker";

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
    {/*<Routed />*/}
    <App3 />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
