/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Component, JSX } from "solid-js";
import "./index.css";
import AudioPlayer from "./lib/components/AudioPlayer";
import Album from "./pages/Album";
import Artist from "./pages/Artist";
import Home from "./pages/Home";

const root = document.getElementById("root");

const queryClient = new QueryClient();

const BasicLayout: Component<{ children?: JSX.Element }> = (props) => {
  return (
    <div>
      <header></header>
      <main>{props.children}</main>
      <div class="h-10"></div>
      <footer class="bg-red-200">
        <AudioPlayer />
      </footer>
    </div>
  );
};

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={BasicLayout}>
          <Route path="/" component={Home} />
          <Route path="/artist/:id" component={Artist} />
          <Route path="/album/:id" component={Album} />
        </Route>
      </Router>
    </QueryClientProvider>
  ),
  root!,
);
