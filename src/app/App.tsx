import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { onMount } from "solid-js";
import DefaultLayout from "~/app/layouts/DefaultLayout";
import { ApiClientProvider, useApiClient } from "~/context/ApiClient";
import { AuthProvider } from "~/context/AuthContext";
import { MusicManagerProvider } from "~/context/MusicManager";
import { Auth } from "~/lib/api/auth";
import { ApiClient } from "~/lib/api/client";
import { MusicManager } from "~/lib/music-manager";

import Account from "~/app/pages/Account";
import Dashboard from "~/app/pages/Dashboard";
import Home from "~/app/pages/Home";
import Login from "~/app/pages/Login";
import Register from "~/app/pages/Register";
import Setup from "~/app/pages/Setup";
import AlbumById from "~/app/pages/albums/AlbumById";
import Albums from "~/app/pages/albums/Albums";
import ArtistById from "~/app/pages/artists/ArtistById";
import Artists from "~/app/pages/artists/Artists";
import PlaylistById from "~/app/pages/playlists/PlaylistById";
import Playlists from "~/app/pages/playlists/Playlists";
import Tracks from "~/app/pages/tracks/Tracks";

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

        <Route path="/artists" component={Artists} />
        <Route path="/artists/:id" component={ArtistById} />

        <Route path="/tracks" component={Tracks} />

        <Route path="/playlists" component={Playlists} />
        <Route path="/playlists/:id" component={PlaylistById} />

        <Route path="/account" component={Account} />
        <Route path="/dashboard" component={Dashboard} />

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
