import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { ErrorBoundary, For, Suspense } from "solid-js";
import { useApiClient } from "../context/ApiClient";

const Artist = () => {
  const params = useParams<{ id: string }>();
  const apiClient = useApiClient();

  const query = createQuery(() => ({
    queryKey: ["artists", params.id],
    suspense: true,
    throwOnError: true,
    queryFn: async () => {
      const artist = await apiClient.getArtistById(params.id);
      const albums = await apiClient.getArtistAlbumsById(artist.id);

      return {
        ...artist,
        albums: albums.albums,
      };
    },
  }));

  return (
    <>
      <p>Artist Page: {params.id}</p>

      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <p>Artist Id: {query.data?.id}</p>
          <p>Artist Name: {query.data?.name}</p>
          <p>Artist Picture: {query.data?.picture}</p>

          <div class="flex flex-col">
            <For each={query.data?.albums}>
              {(album) => {
                return <a href={`/album/${album.id}`}>{album.name}</a>;
              }}
            </For>
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default Artist;
