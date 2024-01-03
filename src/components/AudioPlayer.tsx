import {
  HiSolidBackward,
  HiSolidForward,
  HiSolidPause,
  HiSolidPlay,
} from "solid-icons/hi";
import { createSignal, type Component, Show } from "solid-js";

const PlayIcon: Component<{ class?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      class={props.class}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
      />
    </svg>
  );
};

const [state, setState] = createSignal<"playing" | "paused" | "loading">(
  "paused"
);
const [time, setTime] = createSignal<{ time: number; duration: number }>({
  time: 0,
  duration: 0,
});

class AudioHandler {
  audioEl: HTMLAudioElement;

  constructor(audioEl: HTMLAudioElement) {
    this.audioEl = audioEl;
    this.audioEl.src = "http://localhost:3000/public/test.mp3";

    this.audioEl.addEventListener("durationchange", () => {
      setTime((prev) => ({ time: prev.time, duration: this.audioEl.duration }));
    });
    this.audioEl.addEventListener("volumechange", () => {});
    this.audioEl.addEventListener("loadstart", () => {
      setState("loading");
    });
    this.audioEl.addEventListener("loadeddata", () => {
      setState("paused");
    });
    this.audioEl.addEventListener("timeupdate", () => {
      setTime({
        time: this.audioEl.currentTime,
        duration: this.audioEl.duration,
      });
    });
    this.audioEl.addEventListener("play", () => {
      setState("playing");
    });
    this.audioEl.addEventListener("pause", () => {
      setState("paused");
    });
  }

  toggle() {
    if (state() == "playing") {
      this.audioEl.pause();
    } else if (state() == "paused") {
      this.audioEl.play();
    }
  }
}

const audio = !import.meta.env.SSR ? new AudioHandler(new Audio()) : null;

function formatTime(s: number) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);

  return `${min}:${sec.toString().padStart(2, "0")}`;
}

const AudioPlayer = () => {
  return (
    <div class="flex items-center h-full gap-4">
      <div class="flex gap-2">
        <HiSolidBackward size="30" />
        <button
          onClick={() => {
            audio?.toggle();
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
        <HiSolidForward size="30" />
      </div>
      <p>
        {formatTime(time().time)} / {formatTime(time().duration)}
      </p>
    </div>
  );
};

export default AudioPlayer;
