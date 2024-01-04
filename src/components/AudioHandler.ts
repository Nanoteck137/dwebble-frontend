import { createSignal } from "solid-js";
import type { Track } from "src/models/track";

export const [state, setState] = createSignal<
  "playing" | "paused" | "loading"
>("paused");
export const [time, setTime] = createSignal<{
  time: number;
  duration: number;
}>({
  time: 0,
  duration: 0,
});

export const [queue, setQueue] = createSignal<{
  index: number;
  items: Track[];
}>({
  index: 0,
  items: [],
});

class AudioHandler {
  audioEl: HTMLAudioElement;

  volume: number = 0;

  queueIndex: number;
  queue: Track[];

  constructor(audioEl: HTMLAudioElement) {
    this.queueIndex = 0;
    this.queue = [];

    this.audioEl = audioEl;
    const volume = parseFloat(localStorage.getItem("player-volume") || "1.0");
    this.setVolume(volume);

    this.audioEl.addEventListener("durationchange", () => {
      setTime((prev) => ({
        time: prev.time,
        duration: this.audioEl.duration,
      }));
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
    this.audioEl.addEventListener("playing", () => {
      setState("playing");
    });
    this.audioEl.addEventListener("pause", () => {
      setState("paused");
    });
    this.audioEl.addEventListener("ended", () => {
      this.next();
    });
  }

  setVolume(vol: number) {
    this.volume = vol;
    this.audioEl.volume = vol;
    localStorage.setItem("player-volume", vol.toString());
  }

  setQueue(newQueue: Track[]) {
    this.queue = [...newQueue];
    this.queueIndex = 0;

    setQueue({ index: this.queueIndex, items: [...this.queue] });
    this.updateAudio();
  }

  setQueueIndex(index: number) {
    this.queueIndex = index;
    if (this.queueIndex >= this.queue.length) {
      this.queueIndex = this.queue.length - 1;
    }

    if (this.queueIndex < 0) {
      this.queueIndex = 0;
    }

    this.updateAudio();
    setQueue((prev) => ({ ...prev, index: this.queueIndex }));
  }

  updateAudio() {
    const file = this.queue[this.queueIndex].filename;
    this.audioEl.src = `http://localhost:3000/tracks/${file}`;
    this.audioEl.play();
  }

  next() {
    this.setQueueIndex(this.queueIndex + 1);
  }

  prev() {
    this.setQueueIndex(this.queueIndex - 1);
  }

  toggle() {
    if (state() == "playing") {
      this.audioEl.pause();
    } else if (state() == "paused") {
      this.audioEl.play();
    }
  }

  seek(n: number) {
    this.audioEl.currentTime = n;
  }
}

export const audioHandler = !import.meta.env.SSR
  ? new AudioHandler(new Audio())
  : null;
