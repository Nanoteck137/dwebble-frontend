import { Track } from "./models/apiGen";
import { MusicTrack } from "./musicManager";

export function formatTime(s: number) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);

  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function trackToMusicTrack(track: Track): MusicTrack {
  return {
    name: track.name,
    artistName: track.artistName,
    source: track.mobileQualityFile,
    coverArt: track.coverArt,
  };
}
