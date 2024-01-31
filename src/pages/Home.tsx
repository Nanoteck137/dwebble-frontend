import { createQuery } from "@tanstack/solid-query";
import { For, Match, Switch } from "solid-js";
import { getArtists } from "../lib/api/artist";

const Home = () => {
  const query = createQuery(() => ({
    queryKey: ["artists"],
    queryFn: getArtists,
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