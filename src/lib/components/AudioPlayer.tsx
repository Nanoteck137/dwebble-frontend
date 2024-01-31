import { createAudio } from "@solid-primitives/audio";
import {
  Match,
  Switch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { useMusicManager } from "../../context/MusicManager";
import { formatTime } from "../utils";

function getVolume() {
  const vol = localStorage.getItem("player-volume");
  if (vol) {
    return parseFloat(vol);
  }

  return 1.0;
}

const AudioPlayer = () => {
  const [trackSource, setTrackSource] = createSignal("");
  const [trackName, setTrackName] = createSignal("");
  const [updatedServer, setUpdatedServer] = createSignal(false);

  const [volume, setVolume] = createSignal(getVolume());
  const [audio, controls] = createAudio(trackSource, undefined, volume);

  const musicManager = useMusicManager();

  function ended() {
    console.log("Ended");

    musicManager.nextTrack();
    controls.play();
  }

  onMount(() => {
    audio.player.addEventListener("ended", ended);
    musicManager.emitter.on("onQueueUpdated", () => {
      const track = musicManager.getCurrentTrack();
      setTrackName(track.name);
      setTrackSource(track.source);
      controls.seek(0);
      setTimeout(() => {
        setUpdatedServer(false);
      }, 200);
    });

    musicManager.emitter.on("requestPlay", () => {
      controls.play();
    });

    musicManager.emitter.on("requestPause", () => {
      controls.pause();
    });

    musicManager.emitter.on("requestPlayPause", () => {
      if (audio.state == "playing") controls.pause();
      else if (audio.state == "paused") controls.play();
    });

    onCleanup(() => {
      audio.player.removeEventListener("ended", ended);
    });
  });

  createEffect(() => {
    if (!updatedServer() && audio.currentTime >= audio.duration * 0.3) {
      musicManager.markAsListened();
      setUpdatedServer(true);
    }
  });

  return (
    <>
      <p>Audio Player</p>
      <p>Name: {trackName()}</p>
      <p>
        {formatTime(audio.currentTime)} / {formatTime(audio.duration)}
      </p>
      <input
        type="range"
        value={volume() * 100}
        onInput={(e) => {
          const p = e.target.valueAsNumber / 100;
          setVolume(p);
          localStorage.setItem("player-volume", p.toString());
        }}
      />
      <input
        class="transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200"
        type="range"
        value={(audio.currentTime / audio.duration) * 100}
        onInput={(e) => {
          const p = e.target.valueAsNumber / 100;
          controls.seek(p * audio.duration);
        }}
      />
      <Switch>
        <Match when={audio.state == "playing"}>
          <button onClick={() => controls.pause()}>Pause</button>
        </Match>
        <Match when={audio.state == "paused" || audio.state == "ready"}>
          <button onClick={() => controls.play()}>Play</button>
        </Match>
        <Match when={audio.state == "paused" || audio.state == "ready"}>
          <p>Loading...</p>
        </Match>
      </Switch>

      <button
        onClick={() => {
          musicManager.prevTrack();
          controls.play();
        }}
      >
        Prev
      </button>
      <button
        onClick={() => {
          musicManager.nextTrack();
          controls.play();
        }}
      >
        Next
      </button>
    </>
  );
};

export default AudioPlayer;
