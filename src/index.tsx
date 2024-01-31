/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import {
  Component,
  Index,
  JSX,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { MusicManagerProvider, useMusicManager } from "./context/MusicManager";
import "./index.css";
import AudioPlayer from "./lib/components/AudioPlayer";
import { MusicManager, Queue } from "./lib/musicManager";
import Album from "./pages/Album";
import Artist from "./pages/Artist";
import Home from "./pages/Home";

const root = document.getElementById("root");

const queryClient = new QueryClient();
const musicManager = new MusicManager();

const BasicLayout: Component<{ children?: JSX.Element }> = (props) => {
  const [queue, setQueue] = createSignal<Queue>({ index: 0, items: [] });
  const musicManager = useMusicManager();

  onMount(() => {
    const unsub = musicManager.emitter.on("onQueueUpdated", () => {
      const queue = musicManager.queue;
      console.log("Index", queue.index);
      setQueue((_) => ({ index: queue.index, items: [...queue.items] }));
    });

    document.addEventListener("keyup", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      if (e.key === " ") {
        musicManager.requestPlayPause();
      }
    });

    onCleanup(() => {
      unsub();
    });
  });

  return (
    <div>
      <div class="flex h-screen pb-36">
        <main class="h-full flex-grow">{props.children}</main>
        <div class="w-72 bg-blue-200">
          <Index each={queue().items}>
            {(item, index) => {
              return (
                <div class="flex gap-2">
                  <button
                    onClick={() => {
                      musicManager.setQueueIndex(index);
                      musicManager.requestPlay();
                    }}
                  >
                    Play
                  </button>
                  <p
                    class={` ${queue().index == index ? "text-green-600" : ""}`}
                  >
                    {item().name}
                  </p>
                </div>
              );
            }}
          </Index>
        </div>
      </div>
      <footer class="fixed bottom-0 left-0 right-0 h-36 bg-red-200">
        <AudioPlayer />
      </footer>
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
