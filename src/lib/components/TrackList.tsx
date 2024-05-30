import { createMutation, useQueryClient } from "@tanstack/solid-query";
import {
  DragDropProvider,
  DragDropSensors,
  DragEvent,
  DragOverlay,
  Id,
  SortableProvider,
  closestCenter,
  createSortable,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";
import { HiSolidEllipsisVertical } from "solid-icons/hi";
import { Component, For, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { useApiClient } from "../../context/ApiClient";
import { useMusicManager } from "../../context/MusicManager";
import { createQueryPlaylists } from "../../pages/Playlists";
import { Track } from "../models/apiGen";
import { trackToMusicTrack } from "../utils";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      sortable: boolean;
    }
  }
}

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

const Sortable: Component<{ track: Track; index: number }> = (props) => {
  const sortable = createSortable(props.index + 1);
  const [state] = useDragDropContext()!;
  return (
    <div
      use:sortable
      class="sortable"
      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "transition-transform": !!state.active.draggable,
      }}
    >
      {props.index} - {props.track.name}
    </div>
  );
};

type TrackListType = "album" | "playlist";

type TrackListProps = {
  type: TrackListType;
  name: string;
  tracks: Track[];
};

export const TrackList: Component<TrackListProps> = (props) => {
  const musicManager = useMusicManager();

  const [addToPlaylist, setAddToPlaylist] = createSignal<string | null>(null);

  const [activeItem, setActiveItem] = createSignal<Id | null>(null);
  const ids = () => props.tracks.map((_, i) => i + 1);

  const onDragStart = ({ draggable }: DragEvent) =>
    setActiveItem(draggable.id);

  const onDragEnd = ({ draggable, droppable }: DragEvent) => {
    if (draggable && droppable) {
      const currentItems = ids();
      const fromIndex = currentItems.indexOf(draggable.id as number);
      const toIndex = currentItems.indexOf(droppable.id as number);
      if (fromIndex !== toIndex) {
        console.log("From", fromIndex, "To", toIndex);
        // const updatedItems = currentItems.slice();
        // updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        // setItems(updatedItems);
      }
    }
  };

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

        <Show when={props.type === "playlist"}>
          <button onClick={() => {}}>Edit Playlist</button>
        </Show>

        <DragDropProvider
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          collisionDetector={closestCenter}
        >
          <DragDropSensors />
          <div class="column self-stretch">
            <SortableProvider ids={ids()}>
              <For each={props.tracks}>
                {(track, index) => <Sortable track={track} index={index()} />}
              </For>
            </SortableProvider>
          </div>
          <DragOverlay>
            <div class="sortable">
              {props.tracks[((activeItem() || 1) as number) - 1].name}
            </div>
          </DragOverlay>
        </DragDropProvider>
        {/* {props.tracks.map((track) => {
          return (
            <TrackItem
              track={track}
              onAddToQueue={() => {
                musicManager.addTrackToQueue(trackToMusicTrack(track));
              }}
              onAddToPlaylist={() => {}}
            />
          );
        })} */}
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
