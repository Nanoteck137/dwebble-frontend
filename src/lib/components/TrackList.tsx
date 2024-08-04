import { createMutation, useQueryClient } from "@tanstack/solid-query";
import {
  HiSolidArrowDown,
  HiSolidArrowUp,
  HiSolidBookOpen,
  HiSolidEllipsisVertical,
  HiSolidPencil,
  HiSolidPlay,
} from "solid-icons/hi";
import { Component, For, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { useApiClient } from "~/context/ApiClient";
import { useMusicManager } from "~/context/MusicManager";
import { Track } from "~/lib/api/types";
import { formatTime, trackToMusicTrack } from "~/lib/utils";
import { createQueryPlaylists } from "~/pages/Playlists";

const AddToPlaylist: Component<{ trackId: string; close: () => void }> = (
  props,
) => {
  const apiClient = useApiClient();
  const playlists = createQueryPlaylists(apiClient);

  const queryClient = useQueryClient();

  const addToPlaylist = createMutation(() => ({
    mutationFn: async (data: { playlistId: string; tracks: string[] }) => {
      const res = await apiClient.addItemsToPlaylist(data.playlistId, {
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
            {playlists.data?.map((playlist) => {
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
        <p>
          {props.track.number} - {props.track.name}
        </p>

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
        <div class="absolute right-2 z-[100] flex flex-col gap-2 bg-rose-400 p-4">
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

type HeaderProps = {
  name: string;
  cover: string;

  onPlay: () => void;
};

const Header: Component<HeaderProps> = (props) => {
  return (
    // <div class="fixed h-full w-80 bg-purple-400 px-4 py-11">
    <div class="w-80">
      <img
        class="aspect-square w-80 rounded object-cover"
        src={props.cover}
        alt=""
      />
      <div class="h-2" />
      <p class="line-clamp-2 text-center font-bold">{props.name}</p>
      <div class="h-2" />
      <div class="flex items-center justify-center gap-5">
        <button
          class="button-secondary flex h-10 w-10 items-center justify-center rounded-full p-2 hover:brightness-75 active:scale-95"
          onClick={() => {}}
          title="Quick Add"
        >
          <HiSolidBookOpen class="h-6 w-6" />
        </button>

        <button
          class="button-primary rounded-full p-2 hover:brightness-75 active:scale-95"
          onClick={props.onPlay}
          title="Play"
        >
          <HiSolidPlay class="h-8 w-8" />
        </button>

        <button
          class="button-secondary flex h-10 w-10 items-center justify-center rounded-full p-2 hover:brightness-75 active:scale-95"
          onClick={() => {}}
          title="More"
        >
          <HiSolidEllipsisVertical class="h-6 w-6" />
        </button>
      </div>
      <div class="h-2" />
    </div>
  );
};

type TrackListType = "album" | "playlist" | "playlist_edit";

type TrackListProps = {
  type: TrackListType;
  name: string;
  cover: string;
  tracks: Track[];
  disableMove?: boolean;

  onEditClicked?: () => void;
  onSaveClicked?: () => void;
  onCancelClicked?: () => void;
  onMoveItem?: (fromIndex: number, toIndex: number) => void;
};

export const TrackList: Component<TrackListProps> = (props) => {
  const musicManager = useMusicManager();

  // const [addToPlaylist, setAddToPlaylist] = createSignal<string | null>(null);

  // const [editItem, setEditItem] = createSignal<number | null>(null);

  // <div class="fixed h-full w-80 px-4 py-11"></div>

  return (
    <>
      <div class="flex flex-col gap-2 px-5">
        <div class="flex justify-center md:fixed md:h-full">
          <Header
            name={props.name}
            cover={props.cover}
            onPlay={() => {
              musicManager.clearQueue();

              props.tracks.forEach((t) =>
                musicManager.addTrackToQueue(trackToMusicTrack(t)),
              );
            }}
          />
        </div>
        <div class="md:ml-5 md:pl-80">
          <div class="flex flex-col gap-2">
            <For each={props.tracks}>
              {(track) => {
                return (
                  <div class="group flex items-center gap-2 border-b pb-1 pr-4">
                    <p class="w-10 text-right font-medium group-hover:hidden">
                      {track.number}.
                    </p>
                    <button
                      class="hidden h-10 w-10 items-center justify-end group-hover:flex"
                      onClick={() => {
                        musicManager.clearQueue();

                        props.tracks.forEach((t) =>
                          musicManager.addTrackToQueue(
                            trackToMusicTrack(t),
                            false,
                          ),
                        );

                        const index = props.tracks.findIndex(
                          (t) => t.id == track.id,
                        );
                        musicManager.setQueueIndex(index);

                        musicManager.requestPlay();
                      }}
                    >
                      <HiSolidPlay class="h-6 w-6" />
                    </button>
                    <div class="flex flex-grow flex-col">
                      <p
                        class="line-clamp-1 font-medium group-hover:underline"
                        title={track.name}
                      >
                        {track.name}
                      </p>
                      <a
                        class="line-clamp-1 w-fit text-sm hover:underline"
                        title={track.artistName}
                        href={`/artist/${track.artistId}`}
                      >
                        {track.artistName}
                      </a>
                    </div>
                    <div>
                      <p class="group-hover:hidden">
                        {formatTime(track.duration)}
                      </p>
                      <button class="hidden rounded-full p-1 hover:bg-black/20 group-hover:block">
                        <HiSolidEllipsisVertical class="h-8 w-8" />
                      </button>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </div>
    </>
  );
};
