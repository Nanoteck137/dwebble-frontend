import {
  HiSolidBackward,
  HiSolidForward,
  HiSolidPause,
  HiSolidPlay,
} from "solid-icons/hi";
import { Show } from "solid-js";
import { audioHandler, state, time } from "./AudioHandler";

function formatTime(s: number) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);

  return `${min}:${sec.toString().padStart(2, "0")}`;
}

const AudioPlayer = () => {
  return (
    <div class="relative  flex items-center h-full gap-4">
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
      <input
        class="w-full"
        type="range"
        value={`${
          time().duration > 0 ? (time().time / time().duration) * 100 : 1
        }`}
        onInput={(e) => {
          const n = (e.currentTarget.valueAsNumber / 100) * time().duration;
          audioHandler?.seek(n);
        }}
      />
    </div>
  );
};

export default AudioPlayer;
