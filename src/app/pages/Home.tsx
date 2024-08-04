import { createQuery } from "@tanstack/solid-query";
import { For, Suspense } from "solid-js";
import { useApiClient } from "~/context/ApiClient";

const Home = () => {
  const apiClient = useApiClient();

  const query = createQuery(() => ({
    queryKey: ["artists"],
    queryFn: async () => {
      const artists = await apiClient.getArtists();
      if (artists.status === "error") throw new Error(artists.error.message);

      return artists.data;
    },
  }));

  return (
    <>
      <p class="text-red-200">Home Page</p>
      <Suspense fallback={<p class="text-blue-400">Loading...</p>}>
        <div class="flex flex-col">
          <For each={query.data?.artists}>
            {(artist) => {
              return <a href={`/artists/${artist.id}`}>{artist.name}</a>;
            }}
          </For>
        </div>
      </Suspense>
    </>
  );
};

export default Home;
