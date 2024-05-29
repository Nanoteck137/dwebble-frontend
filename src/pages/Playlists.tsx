import { Navigate } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Show, Suspense } from "solid-js";
import { useApiClient } from "../context/ApiClient";
import { useAuth } from "../context/AuthContext";

const Playlists = () => {
  const apiClient = useApiClient();

  const auth = useAuth();
  const user = auth.user();

  const query = createQuery(() => ({
    queryKey: ["playlists"],
    queryFn: async () => {
      const artists = await apiClient.getPlaylists();
      if (artists.status === "error") throw new Error(artists.error.message);

      return artists.data;
    },
  }));

  return (
    <Show when={!!user()} fallback={<Navigate href="/" />}>
      <p>Playlists Page</p>

      <Suspense>
        {query.data?.playlists.map((playlist) => {
          return <p>{playlist.name}</p>;
        })}
      </Suspense>
    </Show>
  );
};

export default Playlists;
