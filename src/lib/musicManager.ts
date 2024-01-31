import { Emitter, createNanoEvents } from "nanoevents";

export type Track = {
  name: string;
  artistName: string;
  source: string;
};

export type Queue = {
  index: number;
  items: Track[];
};

export class MusicManager {
  emitter: Emitter;
  queue: Queue = { index: 0, items: [] };

  constructor() {
    this.emitter = createNanoEvents();
  }

  getCurrentTrack() {
    return this.queue.items[this.queue.index];
  }

  addTrackToQueue(track: Track) {
    this.queue.items.push(track);

    this.emitter.emit("onQueueUpdated");
  }

  isEndOfQueue() {
    return this.queue.index >= this.queue.items.length - 1;
  }

  clearQueue() {
    this.queue.index = 0;
    this.queue.items = [];

    this.emitter.emit("onQueueUpdated");
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

  nextTrack() {
    this.setQueueIndex(this.queue.index + 1);
  }

  prevTrack() {
    this.setQueueIndex(this.queue.index - 1);
  }

  requestPlay() {
    this.emitter.emit("requestPlay");
  }

  requestPause() {
    this.emitter.emit("requestPause");
  }

  requestPlayPause() {
    this.emitter.emit("requestPlayPause");
  }

  markAsListened() {
    console.log("Update server");
  }
}
