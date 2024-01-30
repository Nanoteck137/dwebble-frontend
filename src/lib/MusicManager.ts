import { createNanoEvents, type Emitter } from "nanoevents";

export type Track = {
  src: string;
  title: string;
};

export type PlayQueue = {
  index: number;
  items: Track[];
};

class MusicMangager {
  emitter: Emitter;

  queue: PlayQueue = { index: 0, items: [] };

  constructor() {
    this.emitter = createNanoEvents();
  }

  addTrackToQueue(track: Track) {
    this.queue.items.push(track);
    this.emitter.emit("onQueueUpdated");
  }

  clearQueue() {
    this.queue.items = [];
    this.queue.index = 0;
    this.emitter.emit("onQueueUpdated");
  }

  getCurrentTrack() {
    if (this.queue.index >= this.queue.items.length) {
      return null;
    }

    return this.queue.items[this.queue.index];
  }

  setQueueIndex(index: number) {
    if (index >= this.queue.items.length) {
      return;
    }

    if (index < 0) {
      return;
    }

    this.queue.index = index;
    this.emitter.emit("onQueueUpdated");
  }

  next() {
    const newIndex = this.queue.index + 1;
    if (newIndex >= this.queue.items.length) {
      return;
    }

    this.queue.index = newIndex;
    this.emitter.emit("onQueueUpdated");
  }

  prev() {
    const newIndex = this.queue.index - 1;
    if (newIndex < 0) {
      return;
    }

    this.queue.index = newIndex;
    this.emitter.emit("onQueueUpdated");
  }

  onQueueUpdated(callback: VoidFunction) {
    return this.emitter.on("onQueueUpdated", callback);
  }
}

export const musicManager = new MusicMangager();
