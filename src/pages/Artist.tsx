import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Suspense } from "solid-js";
import { useApiClient } from "~/context/ApiClient";

const Artist = () => {
  const params = useParams<{ id: string }>();
  const apiClient = useApiClient();

  const query = createQuery(() => ({
    queryKey: ["artists", params.id],
    queryFn: async () => {
      const artist = await apiClient.getArtistById(params.id);
      if (artist.status === "error") throw new Error(artist.error.message);

      const albums = await apiClient.getArtistAlbumsById(artist.data.id);
      if (albums.status === "error") throw new Error(albums.error.message);

      return {
        ...artist.data,
        albums: albums.data.albums,
      };
    },
  }));

  return (
    <>
      <p>Artist Page: {params.id}</p>

      <Suspense fallback={<p class="text-purple-400">Loading...</p>}>
        <p>Artist Id: {query.data?.id}</p>
        <p>Artist Name: {query.data?.name}</p>
        <p>Artist Picture: {query.data?.picture}</p>

        <img src={query.data?.picture} alt="Picture" />

        <div class="flex flex-col">
          <For each={query.data?.albums}>
            {(album) => {
              return <a href={`/album/${album.id}`}>{album.name}</a>;
            }}
          </For>
        </div>
      </Suspense>
    </>
  );
};

export default Artist;
