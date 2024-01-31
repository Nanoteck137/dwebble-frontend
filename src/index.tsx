/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import "./index.css";
import Artist from "./pages/Artist";
import Home from "./pages/Home";

const root = document.getElementById("root");

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/artist/:id" component={Artist} />
      </Router>
    </QueryClientProvider>
  ),
  root!,
);
