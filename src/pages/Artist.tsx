import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Match, Switch } from "solid-js";
import { getArtistAlbumsById, getArtistById } from "../lib/api/artist";

const Artist = () => {
  const params = useParams<{ id: string }>();

  const query = createQuery(() => ({
    queryKey: ["artists", params.id],
    queryFn: async () => getArtistById(params.id),
  }));

  const albumQuery = createQuery(() => ({
    queryKey: ["artists", params.id, "albums"],
    queryFn: async () => getArtistAlbumsById(params.id),
    enabled: !!query.data,
  }));

  return (
    <>
      <p>Artist Page: {params.id}</p>
      <Switch>
        <Match when={query.isPending || albumQuery.isPending}>
          <p>Loading...</p>
        </Match>
        <Match when={query.isError}>
          <p>{query.error?.message}</p>
        </Match>
        <Match when={albumQuery.isError}>
          <p>{albumQuery.error?.message}</p>
        </Match>
        <Match when={query.isSuccess && albumQuery.isSuccess}>
          <p>Artist Id: {query.data?.id}</p>
          <p>Artist Name: {query.data?.name}</p>
          <p>Artist Picture: {query.data?.picture}</p>

          <div class="flex flex-col">
            <For each={albumQuery.data?.albums}>
              {(album) => {
                return <a href={`/album/${album.id}`}>{album.name}</a>;
              }}
            </For>
          </div>
        </Match>
      </Switch>
    </>
  );
};

export default Artist;
