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
    onCleanup(() => {
      unsub();
    });
  });

  return (
    <div>
      <header class="fixed h-8">
        <button
          onClick={() => {
            musicManager.addTrackToQueue({
              name: "クラクラ",
              artistName: "Ado",
              source:
                "http://localhost:3000/tracks/g1rjo1fof8ud5wc7ghw6rud99zhdscn1.mp3",
            });

            musicManager.addTrackToQueue({
              name: "新時代",
              artistName: "Ado",
              source:
                "http://localhost:3000/tracks/m8jvucxlw6sn32kpc2x5l7or4ri0el7z.mp3",
            });

            musicManager.addTrackToQueue({
              name: "KISS OF DEATH(Produced by HYDE)",
              artistName: "Mika Nakashima",
              source:
                "http://localhost:3000/tracks/h7exeqvy3ho5m2geb9kg86mk9w38nm6y.mp3",
            });
          }}
        >
          Test Queue
        </button>
      </header>
      <div class="flex h-screen pb-36 pt-8">
        <main class="h-full flex-grow">{props.children}</main>
        <div class="w-72 bg-blue-200">
          <Index each={queue().items}>
            {(item, index) => {
              return (
                <p
                  class={` ${queue().index == index ? "text-green-600" : ""}`}
                >
                  {item().name}
                </p>
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
