import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { onMount } from "solid-js";
import DefaultLayout from "~/app/layouts/DefaultLayout";
import { ApiClientProvider, useApiClient } from "~/context/ApiClient";
import { AuthProvider } from "~/context/AuthContext";
import { MusicManagerProvider } from "~/context/MusicManager";
import { Auth } from "~/lib/api/auth";
import { ApiClient } from "~/lib/api/client";
import { MusicManager } from "~/lib/musicManager";

import AlbumById from "~/app/pages/albums/AlbumById";
import Albums from "~/app/pages/albums/Albums";

import Artist from "~/pages/Artist";
import Home from "~/pages/Home";
import Login from "~/pages/Login";
import Playlists from "~/pages/Playlists";
import Register from "~/pages/Register";
import Setup from "~/pages/Setup";
import ViewPlaylist from "~/pages/ViewPlaylist";

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
      <Route path="/" component={DefaultLayout}>
        <Route path="/" component={Home} />
        <Route path="/albums" component={Albums} />
        <Route path="/albums/:id" component={AlbumById} />

        <Route path="/artist/:id" component={Artist} />
        <Route path="/playlists" component={Playlists} />
        <Route path="/viewplaylist/:id" component={ViewPlaylist} />

        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Route>

      <Route path="/setup" component={Setup} />
    </Router>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicManagerProvider musicManager={musicManager}>
        <ApiClientProvider client={apiClient}>
          <AuthProvider auth={auth}>
            <AppRouter />
          </AuthProvider>
        </ApiClientProvider>
      </MusicManagerProvider>
    </QueryClientProvider>
  );
};

export default App;
