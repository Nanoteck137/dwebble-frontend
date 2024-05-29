import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { HiSolidEllipsisVertical } from "solid-icons/hi";
import { Component, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { useApiClient } from "../../context/ApiClient";
import { useMusicManager } from "../../context/MusicManager";
import { createQueryPlaylists } from "../../pages/Playlists";
import { Track } from "../models/apiGen";
import { trackToMusicTrack } from "../utils";

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

type ItemProps = {
  track: Track;

  onAddToQueue: () => void;
  onAddToPlaylist: () => void;
};

const Item: Component<ItemProps> = (props) => {
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <div class="relative">
      <div class="flex justify-between">
        <p>{props.track.name}</p>

        <button
          onClick={() => {
            setMenuOpen(true);
          }}
        >
          <HiSolidEllipsisVertical class="h-7 w-7" />
        </button>
      </div>

      <Show when={menuOpen()}>
        <div class="absolute right-2 z-50 flex flex-col gap-2 bg-rose-400 p-4">
          <button
            onClick={() => {
              props.onAddToQueue();
              setMenuOpen(false);
            }}
          >
            Add to Queue
          </button>
          <button
            onClick={() => {
              props.onAddToPlaylist();
              setMenuOpen(false);
            }}
          >
            Add to Playlist
          </button>
        </div>
        <div
          class="fixed inset-0 z-40 opacity-0"
          onClick={() => setMenuOpen(false)}
        ></div>
      </Show>
    </div>
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
            musicManager.clearQueue();

            props.tracks.forEach((t) =>
              musicManager.addTrackToQueue(trackToMusicTrack(t)),
            );
          }}
        >
          Play
        </button>

        <button
          onClick={() => {
            props.tracks.forEach((t) =>
              musicManager.addTrackToQueue(trackToMusicTrack(t)),
            );
          }}
        >
          Add to queue
        </button>

        {props.tracks.map((track) => {
          return (
            <Item
              track={track}
              onAddToQueue={() => {
                musicManager.addTrackToQueue(trackToMusicTrack(track));
              }}
              onAddToPlaylist={() => {}}
            />
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
