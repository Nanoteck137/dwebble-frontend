import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { Component, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { useApiClient } from "../../context/ApiClient";
import { useMusicManager } from "../../context/MusicManager";
import { createQueryPlaylists } from "../../pages/Playlists";
import { Track } from "../models/apiGen";
import { MusicTrack } from "../musicManager";

const AddToPlaylist: Component<{ trackId: string; close: () => void }> = (
  props,
) => {
  const apiClient = useApiClient();
  const playlists = createQueryPlaylists(apiClient);

  const queryClient = useQueryClient();

  const addToPlaylist = createMutation(() => ({
    mutationFn: async (data: { playlistId: string; tracks: string[] }) => {
      const res = await apiClient.addItemsToPlaylists(data.playlistId, {
        tracks: data.tracks,
      });

      if (res.status === "error") throw new Error(res.error.message);

      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["playlists"],
      });
    },
  }));

  return (
    <Portal>
      <div class="fixed inset-0 z-50 bg-black/75">
        <div class="bg-purple-400">
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
      </div>
    </Portal>
  );
};

type TrackListProps = {
  name: string;
  tracks: Track[];
};

const TrackList: Component<TrackListProps> = (props) => {
  const musicManager = useMusicManager();

  const [addToPlaylist, setAddToPlaylist] = createSignal<string | null>(null);

  return (
    <>
      <div>
        <p class="text-2xl">{props.name}</p>

        <button
          onClick={() => {
            const tracks: MusicTrack[] = props.tracks.map((t) => ({
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

        {props.tracks.map((track) => {
          return (
            <div class="flex justify-between">
              <p>{track.name}</p>

              <button
                onClick={() => {
                  setAddToPlaylist(track.id);
                }}
              >
                Add to Playlist
              </button>
            </div>
          );
        })}
      </div>

      <Show when={!!addToPlaylist()}>
        <AddToPlaylist
          trackId={addToPlaylist()!}
          close={() => setAddToPlaylist(null)}
        />
      </Show>
    </>
  );
};

export default TrackList;
