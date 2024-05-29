import { useParams } from "@solidjs/router";
import { createMutation, createQuery } from "@tanstack/solid-query";
import { Component, For, Show, Suspense, createSignal } from "solid-js";
import { useApiClient } from "../context/ApiClient";
import { useMusicManager } from "../context/MusicManager";
import { MusicTrack } from "../lib/musicManager";
import { formatTime } from "../lib/utils";
import { createQueryPlaylists } from "./Playlists";

const AddToPlaylist: Component<{ trackId: string; close: () => void }> = (
  props,
) => {
  const apiClient = useApiClient();
  const playlists = createQueryPlaylists(apiClient);

  const addToPlaylist = createMutation(() => ({
    mutationFn: async (data: { playlistId: string; tracks: string[] }) => {
      const res = await apiClient.addItemsToPlaylists(data.playlistId, {
        tracks: data.tracks,
      });

      if (res.status === "error") throw new Error(res.error.message);

      return res.data;
    },
  }));

  return (
    <div class="fixed bg-purple-300">
      <p>Add To Playlist: {props.trackId}</p>

      <div class="flex flex-col gap-1">
        {playlists.data?.playlists.map((playlist) => {
          return (
            <button
              onClick={() => {
                addToPlaylist.mutate({
                  playlistId: playlist.id,
                  tracks: [props.trackId],
                });

                props.close();
              }}
            >
              {playlist.name}
            </button>
          );
        })}
      </div>

      <button onClick={() => props.close()}>Close</button>
    </div>
  );
};

const Album = () => {
  const params = useParams<{ id: string }>();
  const apiClient = useApiClient();

  const query = createQuery(() => ({
    queryKey: ["albums", params.id],
    queryFn: async () => {
      const album = await apiClient.getAlbumById(params.id);
      if (album.status === "error") throw new Error(album.error.message);

      const tracks = await apiClient.getAlbumTracksById(album.data.id);
      if (tracks.status === "error") throw new Error(tracks.error.message);

      return {
        ...album.data,
        tracks: tracks.data.tracks,
      };
    },
  }));

  const musicManager = useMusicManager();

  const [addToPlaylist, setAddToPlaylist] = createSignal<string>();

  return (
    <>
      <p>Album Page: {params.id}</p>

      <Suspense fallback={<p>Loading...</p>}>
        <p>Album Id: {query.data?.id}</p>
        <p>Album Name: {query.data?.name}</p>
        <p>Album Picture: {query.data?.coverArt}</p>
        <p>Album Artist: {query.data?.artistId}</p>

        <img class="h-48" src={query.data?.coverArt} alt="Cover Art" />

        <button
          onClick={() => {
            const tracks: MusicTrack[] = query.data!.tracks.map((t) => ({
              name: t.name,
              artistName: t.artistName,
              source: t.mobileQualityFile,
              coverArt: t.coverArt,
            }));
            tracks.forEach((t) => musicManager.addTrackToQueue(t));
            musicManager.requestPlay();
          }}
        >
          Add to queue
        </button>
        <For each={query.data?.tracks}>
          {(track) => {
            return (
              <div class="flex justify-between">
                <p>
                  {track.number} - {track.name} - {formatTime(track.duration)}
                </p>
                <button
                  onClick={() => {
                    setAddToPlaylist(track.id);
                  }}
                >
                  Add to Playlist
                </button>
              </div>
            );
          }}
        </For>
      </Suspense>

      <Show when={!!addToPlaylist()}>
        <AddToPlaylist
          trackId={addToPlaylist()!}
          close={() => setAddToPlaylist(undefined)}
        />
      </Show>
    </>
  );
};

export default Album;
