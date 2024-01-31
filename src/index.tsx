/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import "./index.css";
import Home from "./pages/Home";

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Route path="/" component={Home} />
    </Router>
  ),
  root!,
);
