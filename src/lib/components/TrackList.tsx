import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { HiSolidEllipsisVertical } from "solid-icons/hi";
import {
  Component,
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { Portal } from "solid-js/web";
import Sortable, { MultiDrag } from "sortablejs";
import { useApiClient } from "../../context/ApiClient";
import { useMusicManager } from "../../context/MusicManager";
import { createQueryPlaylists } from "../../pages/Playlists";
import { Track } from "../models/apiGen";
import { trackToMusicTrack } from "../utils";

Sortable.mount(new MultiDrag());

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

  onAddToQueue: () => void;
  onAddToPlaylist: () => void;
};

const TrackItem: Component<TrackItemProps> = (props) => {
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

type SortableTrackListProps = {
  tracks: Track[];

  onMoveItem?: (fromIndex: number, toIndex: number) => void;
};

const SortableTrackList: Component<SortableTrackListProps> = (props) => {
  var sortable: Sortable | undefined;

  console.log("Sort");

  const [tracks, setTracks] = createSignal<Track[]>();

  createEffect(() => {
    if (sortable) sortable.destroy();
    console.log(props.tracks);

    setTracks([...props.tracks]);
  });

  function createSort(el: HTMLElement) {
    sortable = Sortable.create(el!, {
      forceFallback: true,
      scrollSensitivity: 50.0,
      handle: ".handle",
      multiDrag: true,
      selectedClass: "selected",
      onEnd: (event) => {
        event.preventDefault();
        props.onMoveItem?.(event.oldIndex!, event.newIndex!);
        console.log(event);
      },
    });
  }

  onCleanup(() => {
    sortable?.destroy();
  });

  return (
    <div
      class="flex flex-col gap-2"
      ref={(el) => {
        console.log("HELLO");
        sortable?.destroy();
        createSort(el);
      }}
    >
      <For each={tracks()}>
        {(track, index) => {
          return (
            <div class="flex">
              <div class="handle h-10 w-10 bg-red-400"></div>
              <p>
                {index()} - {track.number} - {track.name}
              </p>
            </div>
          );
        }}
      </For>
    </div>
  );
};

type TrackListType = "album" | "playlist" | "playlist_edit";

type TrackListProps = {
  type: TrackListType;
  name: string;
  tracks: Track[];

  onEditClicked?: () => void;
  onSaveClicked?: () => void;
  onCancelClicked?: () => void;
  onMoveItem?: (fromIndex: number, toIndex: number) => void;
};

export const TrackList: Component<TrackListProps> = (props) => {
  const musicManager = useMusicManager();

  const [addToPlaylist, setAddToPlaylist] = createSignal<string | null>(null);

  return (
    <>
      <div>
        <p class="text-2xl">{props.name}</p>

        <Show when={props.type !== "playlist_edit"}>
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

        <Show when={props.type === "playlist"}>
          <button
            onClick={() => {
              props.onEditClicked?.();
            }}
          >
            Edit Playlist
          </button>
        </Show>

        <Show when={props.type === "playlist_edit"}>
          <button
            onClick={() => {
              props.onSaveClicked?.();
            }}
          >
            Save Edit
          </button>

          <button
            onClick={() => {
              props.onCancelClicked?.();
            }}
          >
            Cancel Edit
          </button>
        </Show>

        <Show
          when={props.type === "playlist_edit"}
          fallback={props.tracks.map((track) => {
            return (
              <TrackItem
                track={track}
                onAddToQueue={() => {
                  musicManager.addTrackToQueue(trackToMusicTrack(track));
                }}
                onAddToPlaylist={() => {}}
              />
            );
          })}
        >
          <SortableTrackList
            tracks={props.tracks}
            onMoveItem={props.onMoveItem}
          />
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
