import { HiSolidPlay, HiSolidXMark } from "solid-icons/hi";
import { TbClearAll } from "solid-icons/tb";
import { Component, For, createSignal, onCleanup, onMount } from "solid-js";
import { useMusicManager } from "../../context/MusicManager";
import { Track } from "../musicManager";

interface QueueItemProps {
  isPlaying: boolean;
  track: Track;
  onPlayClick: () => void;
}

const QueueItem: Component<QueueItemProps> = (props) => {
  return (
    <div class="group flex items-center gap-1">
      <div class="relative aspect-square h-12">
        <img
          class="h-full w-full rounded object-cover"
          src="https://placehold.co/800x500.png"
          alt="Cover Art"
        />
        <button
          class="absolute left-0 top-0 hidden h-full w-full items-center justify-center rounded bg-black/40 text-white group-hover:flex"
          onClick={props.onPlayClick}
        >
          <HiSolidPlay size={24} />
        </button>
      </div>
      <div class="flex flex-col">
        <p
          class={`line-clamp-1 text-ellipsis text-sm ${props.isPlaying ? "text-pink-300" : ""}`}
          title={props.track.name}
        >
          {props.track.name}
        </p>
        <p class="line-clamp-1 text-ellipsis text-xs">
          {props.track.artistName}
        </p>
      </div>
    </div>
  );
};

interface PlayQueueProps {
  isOpen: boolean;
  close: () => void;
}

const PlayQueue: Component<PlayQueueProps> = (props) => {
  const [tracks, setTracks] = createSignal<Track[]>([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);

  const musicManager = useMusicManager();

  onMount(() => {
    let unsub = musicManager.emitter.on("onQueueUpdated", () => {
      setTracks([...musicManager.queue.items]);
      setCurrentIndex(musicManager.queue.index);
    });

    onCleanup(() => {
      unsub();
    });
  });

  return (
    <>
      <div
        class="fixed bottom-0 left-0 right-0 top-0 z-50 bg-pink-300/60"
        classList={{
          hidden: !props.isOpen,
        }}
        onClick={() => props.close()}
      >
        <div
          class="absolute bottom-0 right-0 top-0 flex w-96 flex-col overflow-y-scroll bg-blue-300 p-4"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div class="flex items-center justify-between px-2">
            <p class="text-center text-2xl">Play Queue</p>
            <div class="flex gap-1">
              <button
                onClick={() => {
                  musicManager.clearQueue();
                  props.close();
                }}
              >
                <TbClearAll size={28} />
              </button>
              <button onClick={() => props.close()}>
                <HiSolidXMark size={28} />
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <For each={tracks()}>
              {(track, index) => {
                return (
                  <QueueItem
                    isPlaying={index() === currentIndex()}
                    track={track}
                    onPlayClick={() => {
                      musicManager.setQueueIndex(index());
                      musicManager.requestPlay();
                    }}
                  />
                );
              }}
            </For>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayQueue;
