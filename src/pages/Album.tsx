import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Match, Switch } from "solid-js";
import { useMusicManager } from "../context/MusicManager";
import { getAlbumById, getAlbumTracksById } from "../lib/api/album";
import { Track } from "../lib/musicManager";

const Album = () => {
  const params = useParams<{ id: string }>();

  const query = createQuery(() => ({
    queryKey: ["albums", params.id],
    queryFn: async () => getAlbumById(params.id),
  }));

  const tracksQuery = createQuery(() => ({
    queryKey: ["albums", params.id, "tracks"],
    queryFn: async () => getAlbumTracksById(query.data!.id),
    enabled: !!query.data,
  }));

  const musicManager = useMusicManager();

  return (
    <>
      <p>Album Page: {params.id}</p>
      <Switch>
        <Match when={query.isPending || tracksQuery.isPending}>
          <p>Loading...</p>
        </Match>
        <Match when={query.isError}>
          <p>{query.error?.message}</p>
        </Match>
        <Match when={tracksQuery.isError}>
          <p>{tracksQuery.error?.message}</p>
        </Match>
        <Match when={query.isSuccess && tracksQuery.isSuccess}>
          <p>Album Id: {query.data?.id}</p>
          <p>Album Name: {query.data?.name}</p>
          <p>Album Picture: {query.data?.coverArt}</p>
          <p>Album Artist: {query.data?.artistId}</p>
          <button
            onClick={() => {
              const tracks: Track[] = tracksQuery.data!.tracks.map((t) => ({
                name: t.name,
                artistName: t.artistId,
                source: t.mobileQualityFile,
              }));
              tracks.forEach((t) => musicManager.addTrackToQueue(t));
              musicManager.requestPlay();
            }}
          >
            Add to queue
          </button>
          <For each={tracksQuery.data?.tracks}>
            {(track) => {
              return <p>{track.name}</p>;
            }}
          </For>
        </Match>
      </Switch>
    </>
  );
};

export default Album;
