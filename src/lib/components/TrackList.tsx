import {
  HiSolidBookOpen,
  HiSolidEllipsisVertical,
  HiSolidPlay,
} from "solid-icons/hi";
import { Component, For } from "solid-js";
import { useMusicManager } from "~/context/MusicManager";
import { Track } from "~/lib/api/types";
import { formatTime, trackToMusicTrack } from "~/lib/utils";

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
