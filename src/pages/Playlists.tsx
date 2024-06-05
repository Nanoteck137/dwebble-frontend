import { createQuery } from "@tanstack/solid-query";
import { Suspense } from "solid-js";
import { useApiClient } from "~/context/ApiClient";
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
  const query = createQueryPlaylists(apiClient);

  return (
    <>
      <p>Playlists Page</p>

      <Suspense>
        {query.data?.map((playlist) => {
          return <a href={`/viewplaylist/${playlist.id}`}>{playlist.name}</a>;
        })}
      </Suspense>
    </>
  );
};

export default Playlists;
