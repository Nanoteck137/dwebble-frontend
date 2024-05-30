/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import {
  Component,
  ErrorBoundary,
  JSX,
  Show,
  createSignal,
  onMount,
} from "solid-js";
import { ApiClientProvider } from "./context/ApiClient";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MusicManagerProvider, useMusicManager } from "./context/MusicManager";
import "./index.css";
import ApiClient, { Auth } from "./lib/api/client";
import AudioPlayer from "./lib/components/AudioPlayer";
import { MusicManager } from "./lib/musicManager";
import { trackToMusicTrack } from "./lib/utils";
import Album from "./pages/Album";
import Artist from "./pages/Artist";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Playlists from "./pages/Playlists";
import Register from "./pages/Register";
import ViewPlaylist from "./pages/ViewPlaylist";

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
const apiClient = new ApiClient("http://10.28.28.6:3000");
const auth = new Auth(apiClient);

const BasicLayout: Component<{ children?: JSX.Element }> = (props) => {
  const auth = useAuth();
  const user = auth.user();

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
    <div class="">
      <div class="flex h-screen flex-col">
        <div class="flex h-full">
          <aside class="fixed bottom-0 left-0 top-0 z-30 w-60 bg-blue-400">
            <div class="flex h-16 items-center bg-emerald-400 px-4">
              <a class="text-3xl" href="/">
                Dwebble
              </a>
            </div>
            <nav class="flex flex-col px-4">
              <a href="/">Home</a>
              <a href="">Albums</a>
              <a href="">Artists</a>
              <Show when={!!user()}>
                <a href="/playlists">Playlists</a>
              </Show>
            </nav>
          </aside>
          <div class="flex-grow">
            <header class="fixed left-0 right-0 top-0 z-20 h-16 w-full bg-red-400 pl-60">
              <Show when={!!user()}>
                <div class="flex gap-2">
                  <p>{user()!.username}</p>
                  <button
                    class="text-blue-400"
                    onClick={() => {
                      auth.resetToken();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </Show>
              <button
                onClick={async () => {
                  const queue = await apiClient.createRandomQueue();
                  if (queue.status === "error")
                    throw new Error(queue.error.message);

                  musicManager.clearQueue();

                  queue.data.tracks.forEach((t) =>
                    musicManager.addTrackToQueue(trackToMusicTrack(t)),
                  );
                }}
              >
                Random Play
              </button>
            </header>

            <main
              class={`ml-60 mt-16 bg-green-400 ${showPlayer() ? "mb-20" : ""}`}
            >
              <ErrorBoundary
                fallback={(err) => {
                  console.error(err);
                  return <p class="text-red-500">Error: {err.message}</p>;
                }}
              >
                <div class="overflow-y-scroll">{props.children}</div>
              </ErrorBoundary>
            </main>
          </div>
        </div>
        <footer
          class="fixed bottom-0 left-0 right-0 z-30 h-20 bg-purple-400"
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
          <AuthProvider auth={auth}>
            <Router>
              <Route path="/" component={BasicLayout}>
                <Route path="/" component={Home} />
                <Route path="/artist/:id" component={Artist} />
                <Route path="/album/:id" component={Album} />
                <Route path="/playlists" component={Playlists} />
                <Route path="/viewplaylist/:id" component={ViewPlaylist} />

                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
              </Route>
            </Router>
          </AuthProvider>
        </ApiClientProvider>
      </MusicManagerProvider>
    </QueryClientProvider>
  ),
  root!,
);
