/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Component, JSX, Show, createSignal, onMount } from "solid-js";
import { MusicManagerProvider, useMusicManager } from "./context/MusicManager";
import "./index.css";
import AudioPlayer from "./lib/components/AudioPlayer";
import { MusicManager } from "./lib/musicManager";
import Album from "./pages/Album";
import Artist from "./pages/Artist";
import Home from "./pages/Home";

const root = document.getElementById("root");

const queryClient = new QueryClient();
const musicManager = new MusicManager();

const BasicLayout: Component<{ children?: JSX.Element }> = (props) => {
  const musicManager = useMusicManager();
  const [showPlayer, setShowPlayer] = createSignal(
    !musicManager.isQueueEmpty(),
  );

  onMount(() => {
    musicManager.emitter.on("onQueueUpdated", () => {
      setShowPlayer(!musicManager.isQueueEmpty());
    });

    document.addEventListener("keyup", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      if (e.key === " ") {
        musicManager.requestPlayPause();
      }
    });
  });

  return (
    <div>
      <div class="flex h-screen flex-col">
        <header class="min-h-16 w-full bg-red-400"></header>

        <div class="flex h-full">
          <aside class="h-full min-w-60 bg-blue-400">
            <nav class="flex flex-col">
              <a href="/">Home</a>
              <a href="">Albums</a>
              <a href="">Artists</a>
            </nav>
          </aside>
          <main class="h-full flex-grow bg-green-400">{props.children}</main>
        </div>
        <Show when={showPlayer()}>
          <footer class="min-h-20 bg-purple-400">
            <AudioPlayer />
          </footer>
        </Show>
      </div>

      {/* <footer class="fixed bottom-0 left-0 right-0 h-36 bg-red-200">
        <AudioPlayer />
      </footer> */}
    </div>
  );
};

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <MusicManagerProvider musicManager={musicManager}>
        <Router>
          <Route path="/" component={BasicLayout}>
            <Route path="/" component={Home} />
            <Route path="/artist/:id" component={Artist} />
            <Route path="/album/:id" component={Album} />
          </Route>
        </Router>
      </MusicManagerProvider>
    </QueryClientProvider>
  ),
  root!,
);
