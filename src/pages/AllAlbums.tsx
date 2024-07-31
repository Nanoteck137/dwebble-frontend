import { createQuery } from "@tanstack/solid-query";
import { For, Suspense } from "solid-js";
import { useApiClient } from "~/context/ApiClient";

const AllAlbums = () => {
  const apiClient = useApiClient();

  const query = createQuery(() => ({
    queryKey: ["albums"],
    queryFn: async () => {
      const artists = await apiClient.getAlbums();
      if (artists.status === "error") throw new Error(artists.error.message);

      return artists.data;
    },
  }));

  return (
    <>
      <p class="text-red-200">Home Page</p>
      <Suspense fallback={<p class="text-blue-400">Loading...</p>}>
        <div class="flex flex-col">
          <p>Num Albums: {query.data?.albums.length}</p>
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

export default AllAlbums;
