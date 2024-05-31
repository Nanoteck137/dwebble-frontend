import { Navigate } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Show, Suspense } from "solid-js";
import { useApiClient } from "~/context/ApiClient";
import { useAuth } from "~/context/AuthContext";
import { ApiClient } from "~/lib/api/client";

// TODO(patrik): Move
export const createQueryPlaylists = (apiClient: ApiClient) =>
  createQuery(() => ({
    queryKey: ["playlists"],
    queryFn: async () => {
      if (!apiClient.token) {
        return [];
      }

      const artists = await apiClient.getPlaylists();
      if (artists.status === "error") throw new Error(artists.error.message);

      return artists.data.playlists;
    },
  }));

const Playlists = () => {
  const apiClient = useApiClient();

  const auth = useAuth();
  const user = auth.user();

  const query = createQueryPlaylists(apiClient);

  return (
    <Show when={!!user()} fallback={<Navigate href="/" />}>
      <p>Playlists Page</p>

      <Suspense>
        {query.data?.map((playlist) => {
          return <a href={`/viewplaylist/${playlist.id}`}>{playlist.name}</a>;
        })}
      </Suspense>
    </Show>
  );
};

export default Playlists;
