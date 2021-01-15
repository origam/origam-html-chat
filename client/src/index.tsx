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
import { ChatApp } from "./ChatApp/componentIntegrations/ChatApp";
import "./index.scss";
import "./spinner.scss";
import * as serviceWorker from "./serviceWorker";
import { translationsInit } from "util/translation";
import moment from "moment";
import "moment/min/locales";
import { getLocaleFromCookie } from "util/cookies";

function Routed() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <Redirect to="/chatroom" />
        </Route>
        <Route path="/chatroom">
          <ChatApp />
        </Route>
      </Switch>
    </Router>
  );
}

async function main() {
  const locale = getLocaleFromCookie();
  moment.locale(locale);
  try {
    await translationsInit();
  } catch (e) {
    console.error("Could not initialize translations.");
    console.error(e);
  }

  ReactDOM.render(
    <React.StrictMode>
      <Routed />
      {/*<App3 />*/}
    </React.StrictMode>,
    document.getElementById("root")
  );
}

main();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
