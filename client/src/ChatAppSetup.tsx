import axios from "axios";
import React, { useEffect } from "react";
import { flow } from "mobx";

const URL_BASE = 'http://localhost:9099/api';

export function ChatAppSetup() {
  useEffect(() => {
    flow(function*() {
      const users = yield axios.get(`${URL_BASE}/users`);
    })();
  }, []);
  return <div>setup</div>;
}
