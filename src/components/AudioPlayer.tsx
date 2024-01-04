import {
  HiSolidBackward,
  HiSolidForward,
  HiSolidPause,
  HiSolidPlay,
} from "solid-icons/hi";
import { Show, onCleanup, onMount } from "solid-js";
import { audioHandler, queue, state, time } from "./AudioHandler";
import Slider from "./Slider";

function formatTime(s: number) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);

  return `${min}:${sec.toString().padStart(2, "0")}`;
}

const AudioPlayer = () => {
  onMount(() => {
    function keyUp(e: KeyboardEvent) {
      if (e.key == " ") {
        e.preventDefault();
        audioHandler?.toggle();
      }
    }

    document.addEventListener("keyup", keyUp);

    onCleanup(() => {
      document.removeEventListener("keyup", keyUp);
    });
  });

  return (
    <div class="relative flex h-full items-center gap-4">
      <div class="flex gap-2">
        <HiSolidBackward size="30" />
        <button
          onClick={() => {
            audioHandler?.toggle();
          }}
        >
          <Show when={state() === "playing"}>
            <HiSolidPause size="30" />
          </Show>
          <Show when={state() === "paused"}>
            <HiSolidPlay size="30" />
          </Show>
          <Show when={state() === "loading"}>
            <p>Loading</p>
          </Show>
        </button>
        <button onClick={() => audioHandler?.next()}>
          <HiSolidForward size="30" />
        </button>
      </div>
      <p>
        {formatTime(time().time)} / {formatTime(time().duration)}
      </p>

      <div class="flex flex-col">
        <p class="">
          {queue().items.length > 0 ? queue().items[queue().index].name : ""}
        </p>
        <p class="text-sm">
          {queue().items.length > 0
            ? queue().items[queue().index].artistName
            : ""}
        </p>
      </div>

      <Slider
        class="w-48"
        progress={audioHandler?.volume || 1.0}
        onInteract={(p) => {
          audioHandler?.setVolume(p);
        }}
      />

      <div class="absolute -left-4 -right-4 -top-2">
        <Slider
          progress={time().time / time().duration}
          onInteract={(p) => {
            audioHandler?.seek(p * time().duration);
          }}
        />
      </div>
      {/* <input
        class="w-full"
        type="range"
        value={`${
          time().duration > 0 ? (time().time / time().duration) * 100 : 1
        }`}
        onInput={(e) => {
          const n = (e.currentTarget.valueAsNumber / 100) * time().duration;
          audioHandler?.seek(n);
        }}
      /> */}
    </div>
  );
};

export default AudioPlayer;
