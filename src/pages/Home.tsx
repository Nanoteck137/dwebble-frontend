import { createQuery } from "@tanstack/solid-query";
import { For, Match, Switch } from "solid-js";
import { useApiClient } from "../context/ApiClient";

const Home = () => {
  const apiClient = useApiClient();

  const query = createQuery(() => ({
    queryKey: ["artists"],
    queryFn: () => apiClient.getArtists(),
  }));

  return (
    <>
      <p class="text-red-200">Home Page</p>
      <Switch>
        <Match when={query.isPending}>
          <p>Loading...</p>
        </Match>
        <Match when={query.isError}>
          <p>{query.error?.message}</p>
        </Match>
        <Match when={query.isSuccess}>
          <div class="flex flex-col">
            <For each={query.data?.artists}>
              {(artist) => {
                return <a href={`/artist/${artist.id}`}>{artist.name}</a>;
              }}
            </For>
          </div>
        </Match>
      </Switch>
    </>
  );
};

export default Home;
