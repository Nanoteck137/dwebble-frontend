/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import {
  QueryClient,
  QueryClientProvider,
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import {
  Component,
  ErrorBoundary,
  JSX,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import { ApiClientProvider, useApiClient } from "~/context/ApiClient";
import { AuthProvider, useAuth } from "~/context/AuthContext";
import { MusicManagerProvider, useMusicManager } from "~/context/MusicManager";
import "~/index.css";
import { Auth } from "~/lib/api/auth";
import { ApiClient } from "~/lib/api/client";
import AudioPlayer from "~/lib/components/AudioPlayer";
import { MusicManager } from "~/lib/musicManager";
import Album from "~/pages/Album";
import AllAlbums from "~/pages/AllAlbums";
import Artist from "~/pages/Artist";
import Home from "~/pages/Home";
import Login from "~/pages/Login";
import Playlists, { createQueryPlaylists } from "~/pages/Playlists";
import Register from "~/pages/Register";
import Setup from "~/pages/Setup";
import ViewPlaylist from "~/pages/ViewPlaylist";

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

const apiBaseUrl = import.meta.env.PROD
  ? ""
  : import.meta.env.VITE_API_URL == undefined
    ? ""
    : import.meta.env.VITE_API_URL;
const apiClient = new ApiClient(apiBaseUrl);
const auth = new Auth(apiClient);
const musicManager = new MusicManager();

const BasicLayout: Component<{ children?: JSX.Element }> = (props) => {
  const auth = useAuth();
  const user = auth.user();

  const musicManager = useMusicManager();
  const [showPlayer, setShowPlayer] = createSignal(
    !musicManager.isQueueEmpty(),
  );

  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const playlists = createQueryPlaylists(apiClient);

  const createPlaylist = createMutation(() => ({
    mutationFn: async (data: { name: string }) => {
      const res = await apiClient.createPlaylist(data);
      if (res.status === "error") throw new Error(res.error.message);

      return res.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  }));

  const librarySync = createMutation(() => ({
    mutationFn: async () => {
      const res = await apiClient.runSync();
      if (res.status === "error") throw new Error(res.error.message);
      return res.data;
    },
  }));

  const libraryStatus = createQuery(() => ({
    queryKey: ["library"],
    queryFn: async () => {
      const res = await apiClient.getSyncStatus();
      if (res.status === "error") throw new Error(res.error.message);
      return res.data;
    },
    // refetchInterval: 1000,
  }));

  onMount(() => {
    // TODO(patrik): Unsub
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

  // TODO(patrik): I don't like this
  createEffect(() => {
    user();

    playlists.refetch();
  });

  return (
    <div class="">
      <div class="flex h-screen flex-col">
        <div class="flex h-full">
          <div class="flex-grow">
            <main class={`${showPlayer() ? "mb-20" : ""}`}>
              <ErrorBoundary
                fallback={(err) => {
                  return <p class="text-red-500">Error: {err?.message}</p>;
                }}
              >
                <div class="">{props.children}</div>
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

const AppRouter = () => {
  const apiClient = useApiClient();

  onMount(async () => {
    const systemInfo = await apiClient.getSystemInfo();
    // TODO(patrik): What to do here?
    if (systemInfo.status === "error") return;

    if (!systemInfo.data.isSetup && window.location.pathname !== "/setup") {
      window.location.href = "/setup";
    }

    if (systemInfo.data.isSetup && window.location.pathname === "/setup") {
      window.location.href = "/";
    }
  });

  return (
    <Router>
      <Route path="/" component={BasicLayout}>
        <Route path="/" component={Home} />
        <Route path="/albums" component={AllAlbums} />
        <Route path="/artist/:id" component={Artist} />
        <Route path="/album/:id" component={Album} />
        <Route path="/playlists" component={Playlists} />
        <Route path="/viewplaylist/:id" component={ViewPlaylist} />

        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Route>

      <Route path="/setup" component={Setup} />
    </Router>
  );
};

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <MusicManagerProvider musicManager={musicManager}>
        <ApiClientProvider client={apiClient}>
          <AuthProvider auth={auth}>
            <AppRouter />
          </AuthProvider>
        </ApiClientProvider>
      </MusicManagerProvider>
    </QueryClientProvider>
  ),
  root!,
);
