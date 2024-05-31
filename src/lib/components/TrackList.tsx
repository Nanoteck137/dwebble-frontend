import { createMutation, useQueryClient } from "@tanstack/solid-query";
import {
  HiSolidArrowDown,
  HiSolidArrowUp,
  HiSolidEllipsisVertical,
  HiSolidPencil,
} from "solid-icons/hi";
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

type TrackItemProps = {
  track: Track;

  disableMove: boolean;

  onEdit: () => void;
  onAddToQueue: () => void;
  onAddToPlaylist: () => void;
};

const TrackItem: Component<TrackItemProps> = (props) => {
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <div class="relative">
      <div class="flex justify-between">
        <p>{props.track.name}</p>

        <div class="flex items-center">
          <button
            onClick={() => {
              setMenuOpen(true);
            }}
          >
            <HiSolidEllipsisVertical class="h-7 w-7" />
          </button>

          <Show when={!props.disableMove}>
            <button
              title="Move Item"
              onClick={() => {
                props.onEdit?.();
              }}
            >
              <HiSolidPencil class="h-5 w-5" />
            </button>
          </Show>
        </div>
      </div>

      <Show when={menuOpen()}>
        <div class="absolute right-2 z-10 flex flex-col gap-2 bg-rose-400 p-4">
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

type EditItemProps = {
  track: Track;
  isMoving: boolean;

  onMoveUp: () => void;
  onMoveDown: () => void;
};

const EditItem: Component<EditItemProps> = (props) => {
  return (
    <div class="flex justify-between">
      <p>{props.track.name}</p>

      <div>
        <Show when={!props.isMoving}>
          <button onClick={() => props.onMoveUp()}>
            <HiSolidArrowUp class="h-6 w-6" />
          </button>

          <button onClick={() => props.onMoveDown()}>
            <HiSolidArrowDown class="h-6 w-6" />
          </button>
        </Show>
      </div>
    </div>
  );
};

type TrackListType = "album" | "playlist" | "playlist_edit";

type TrackListProps = {
  type: TrackListType;
  name: string;
  tracks: Track[];
  disableMove?: boolean;

  onEditClicked?: () => void;
  onSaveClicked?: () => void;
  onCancelClicked?: () => void;
  onMoveItem?: (fromIndex: number, toIndex: number) => void;
};

export const TrackList: Component<TrackListProps> = (props) => {
  const musicManager = useMusicManager();

  const [addToPlaylist, setAddToPlaylist] = createSignal<string | null>(null);

  const [editItem, setEditItem] = createSignal<number | null>(null);

  return (
    <>
      <div>
        <p class="text-2xl">{props.name}</p>

        <Show when={editItem() === null}>
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
        </Show>

        <Show when={editItem() !== null}>
          <button
            onClick={() => {
              setEditItem(null);
            }}
          >
            Exit Edit Mode
          </button>
        </Show>

        <Show
          when={editItem() !== null}
          fallback={props.tracks.map((track, index) => {
            return (
              <TrackItem
                track={track}
                disableMove={!!props.disableMove}
                onEdit={() => {
                  setEditItem(index);
                }}
                onAddToQueue={() => {
                  musicManager.addTrackToQueue(trackToMusicTrack(track));
                }}
                onAddToPlaylist={() => {}}
              />
            );
          })}
        >
          {props.tracks.map((track, index) => {
            return (
              <EditItem
                track={track}
                isMoving={index === editItem()}
                onMoveUp={() => {
                  setEditItem(null);
                }}
                onMoveDown={() => {
                  props.onMoveItem?.(editItem()!, index);
                  setEditItem(null);
                }}
              />
            );
          })}
        </Show>
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
