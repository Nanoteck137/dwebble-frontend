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
          <div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            <For each={query.data?.albums}>
              {(album) => {
                //<a href={`/album/${album.id}`}>{album.name}</a>
                return (
                  <div class="flex flex-col items-center">
                    <div class="group">
                      <a class="relative" href={`/album/${album.id}`}>
                        <img
                          class="aspect-square w-40 rounded object-cover group-hover:brightness-75"
                          src={album.coverArt}
                          alt={`${album.name} Cover Art`}
                          loading="lazy"
                        />

                        <div class="absolute bottom-0 left-0 right-0 top-0 bg-purple-400/70"></div>
                      </a>
                      <div class="h-2" />
                      <a
                        class="line-clamp-2 w-40 text-sm font-medium group-hover:underline"
                        title={album.name}
                        href={`/album/${album.id}`}
                      >
                        {album.name}
                      </a>
                    </div>
                    <a
                      class="line-clamp-1 w-40 text-xs hover:underline"
                      title={album.artistName}
                      href={`/artist/${album.artistId}`}
                    >
                      {album.artistName}
                    </a>
                    <div class="h-2" />
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default AllAlbums;
