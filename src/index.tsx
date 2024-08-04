/* @refresh reload */
import { Portal, render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { HiSolidBars3, HiSolidUser } from "solid-icons/hi";
import { OcHome2, OcSignin2, OcSignout2 } from "solid-icons/oc";
import {
  Component,
  ErrorBoundary,
  JSX,
  Show,
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
  // const queryClient = useQueryClient();
  const playlists = createQueryPlaylists(apiClient);

  // const createPlaylist = createMutation(() => ({
  //   mutationFn: async (data: { name: string }) => {
  //     const res = await apiClient.createPlaylist(data);
  //     if (res.status === "error") throw new Error(res.error.message);

  //     return res.data;
  //   },

  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({ queryKey: ["playlists"] });
  //   },
  // }));

  // const librarySync = createMutation(() => ({
  //   mutationFn: async () => {
  //     const res = await apiClient.runSync();
  //     if (res.status === "error") throw new Error(res.error.message);
  //     return res.data;
  //   },
  // }));

  // const libraryStatus = createQuery(() => ({
  //   queryKey: ["library"],
  //   queryFn: async () => {
  //     const res = await apiClient.getSyncStatus();
  //     if (res.status === "error") throw new Error(res.error.message);
  //     return res.data;
  //   },
  //   // refetchInterval: 1000,
  // }));

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

  const [showSideMenu, setShowSideMenu] = createSignal(false);

  createEffect(() => {
    if (showSideMenu()) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  });

  return (
    <>
      <header class="flex h-16 items-center gap-4 bg-[--bg-color] px-4 py-2">
        <button onClick={() => setShowSideMenu(true)}>
          <HiSolidBars3 class="h-10 w-10" />
        </button>

        <a class="text-3xl font-medium text-[--logo-color]" href="/">
          Dwebble
        </a>

        <Portal>
          <Show when={showSideMenu()}>
            <div
              class="absolute inset-0 bg-[--side-menu-overlay]"
              onClick={() => setShowSideMenu(false)}
            ></div>
          </Show>
          <aside
            class={`absolute bottom-0 top-0 w-80 bg-[--bg-color] text-[--fg-color] transition-transform duration-300 ${showSideMenu() ? "translate-x-0" : "-translate-x-[100%]"}`}
          >
            <Show
              when={!!user()}
              fallback={
                <a
                  class="flex items-center justify-center gap-2"
                  href="/login"
                  onClick={() => setShowSideMenu(false)}
                >
                  <OcSignin2 class="h-8 w-8" />
                  <p class="text-xl">Login</p>
                </a>
              }
            >
              <div class="flex items-center justify-center gap-2">
                <HiSolidUser class="h-8 w-8" />
                <p class="text-xl">{user()?.username}</p>
              </div>
            </Show>

            <Show when={!!user()}>
              <div class="flex items-center justify-center gap-2">
                <OcSignout2 class="h-8 w-8" />
                <button
                  class="text-xl"
                  onClick={() => {
                    auth.resetToken();
                  }}
                >
                  Logout
                </button>
              </div>
            </Show>

            <div class="flex items-center justify-center gap-2">
              <OcHome2 class="h-8 w-8" />
              <a
                class="text-xl"
                href="/albums"
                onClick={() => setShowSideMenu(false)}
              >
                Albums
              </a>
            </div>
          </aside>
        </Portal>
      </header>

      <main class={`${showPlayer() ? "mb-20" : ""}`}>
        <ErrorBoundary
          fallback={(err) => {
            return <p class="text-red-500">Error: {err?.message}</p>;
          }}
        >
          <div class="">{props.children}</div>
        </ErrorBoundary>
      </main>

      <footer classList={{ hidden: !showPlayer() }}>
        <AudioPlayer />
      </footer>
    </>
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
