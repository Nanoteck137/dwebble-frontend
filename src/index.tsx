/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import {
  Component,
  ErrorBoundary,
  JSX,
  createSignal,
  onMount,
} from "solid-js";
import { ApiClientProvider } from "./context/ApiClient";
import { MusicManagerProvider, useMusicManager } from "./context/MusicManager";
import "./index.css";
import ApiClient from "./lib/api/client";
import AudioPlayer from "./lib/components/AudioPlayer";
import ErrorPage from "./lib/components/Error";
import { MusicManager } from "./lib/musicManager";
import Album from "./pages/Album";
import Artist from "./pages/Artist";
import Home from "./pages/Home";

const root = document.getElementById("root");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      throwOnError: true,
      retry: (_failureCount, _error) => {
        return false;
      },
    },
  },
});
const musicManager = new MusicManager();

const apiClient = new ApiClient("http://localhost:3000");

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
        <div class="flex h-full">
          <aside class="fixed bottom-0 left-0 top-0 z-10 w-60 bg-blue-400">
            <div class="flex h-16 items-center bg-emerald-400 px-4">
              <a class="text-3xl" href="/">
                Sewaddle
              </a>
            </div>
            <nav class="flex flex-col px-4">
              <a href="/">Home</a>
              <a href="">Albums</a>
              <a href="">Artists</a>
            </nav>
          </aside>
          <div class="flex-grow">
            <header class="fixed left-0 right-0 top-0 h-16 w-full bg-red-400"></header>

            <main
              class={`ml-60 mt-16 flex-grow bg-green-400 ${showPlayer() ? "mb-20" : ""}`}
            >
              <ErrorBoundary
                fallback={(err) => {
                  let code = 500;
                  let message = "Unknown Error";
                  if (err instanceof Error) {
                    message = err.message;
                  }

                  return <ErrorPage code={code} message={message} />;
                }}
              >
                {props.children}
              </ErrorBoundary>
            </main>
          </div>
        </div>
        <footer
          class="fixed bottom-0 left-0 right-0 z-20 h-20 bg-purple-400"
          classList={{ hidden: !showPlayer() }}
        >
          <AudioPlayer />
        </footer>
      </div>
    </div>
  );
};

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <MusicManagerProvider musicManager={musicManager}>
        <ApiClientProvider client={apiClient}>
          <Router>
            <Route path="/" component={BasicLayout}>
              <Route path="/" component={Home} />
              <Route path="/artist/:id" component={Artist} />
              <Route path="/album/:id" component={Album} />
            </Route>
          </Router>
        </ApiClientProvider>
      </MusicManagerProvider>
    </QueryClientProvider>
  ),
  root!,
);
