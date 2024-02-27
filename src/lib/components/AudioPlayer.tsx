import { createAudio } from "@solid-primitives/audio";
import { BiRegularSkipNext, BiRegularSkipPrevious } from "solid-icons/bi";
import { HiSolidPause, HiSolidPlay } from "solid-icons/hi";
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
import LoadingSpinner from "./LoadingSpinner";
import Slider from "./Slider";

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
  const [artistName, setArtistName] = createSignal("");
  const [updatedServer, setUpdatedServer] = createSignal(false);

  const [volume, setVolume] = createSignal(getVolume());
  const [audio, controls] = createAudio(trackSource, undefined, volume);

  const musicManager = useMusicManager();

  function ended() {
    console.log("Ended");

    if (!musicManager.isEndOfQueue()) {
      musicManager.nextTrack();
      controls.play();
    }
  }

  onMount(() => {
    audio.player.addEventListener("ended", ended);
    musicManager.emitter.on("onQueueUpdated", () => {
      const track = musicManager.getCurrentTrack();
      setTrackName(track.name);
      setTrackSource(track.source);
      setArtistName(track.artistName);
      // controls.seek(0);
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
    <div class="relative h-full">
      {/* <p>Audio Player</p>
      <p>Name: {trackName()}</p> */}
      {/* <p>
        {formatTime(audio.currentTime)} / {formatTime(audio.duration)}
      </p> */}
      {/* <Slider
        initialValue={getVolume()}
        onUpdate={(p) => {
          setVolume(p);
          localStorage.setItem("player-volume", p.toString());
        }}
      /> */}
      {/* <div class="h-2"></div>
      <Slider
        initialValue={0}
        value={audio.currentTime / audio.duration}
        onUpdate={(p) => {
          controls.seek(p * audio.duration);
        }}
      /> */}

      <Slider
        initialValue={0}
        value={audio.currentTime / audio.duration}
        onUpdate={(p) => {
          controls.seek(p * audio.duration);
        }}
      />

      <div class="grid h-full grid-cols-5">
        <div class="flex items-center bg-cyan-600">
          <div class="flex items-center">
            <button
              onClick={() => {
                musicManager.prevTrack();
                controls.play();
              }}
            >
              <BiRegularSkipPrevious size={48} />
            </button>

            <Switch
              fallback={
                <>
                  <button onClick={() => controls.play()}>
                    <HiSolidPlay size={48} />
                  </button>
                </>
              }
            >
              <Match when={audio.state == "playing"}>
                <button onClick={() => controls.pause()}>
                  <HiSolidPause size={48} />
                </button>
              </Match>
              <Match when={audio.state == "paused" || audio.state == "ready"}>
                <button onClick={() => controls.play()}>
                  <HiSolidPlay size={48} />
                </button>
              </Match>
              <Match when={audio.state == "loading"}>
                <LoadingSpinner />
              </Match>
            </Switch>
            <button
              onClick={() => {
                musicManager.nextTrack();
                controls.play();
              }}
            >
              <BiRegularSkipNext size={48} />
            </button>
          </div>

          <p class="text-sm font-medium">
            {formatTime(audio.currentTime)} /{" "}
            {formatTime(Number.isNaN(audio.duration) ? 0 : audio.duration)}
          </p>
        </div>

        <div class="col-span-3 flex items-center justify-center gap-2 bg-amber-600 align-middle">
          <img
            class="aspect-square h-12 rounded object-cover"
            src="https://placehold.co/800x500.png"
            alt="Cover Art"
          />
          <div class="flex flex-col">
            <p class="line-clamp-1 max-w-96 text-ellipsis">{trackName()}</p>

            <p class="line-clamp-1 max-w-96 text-ellipsis text-sm text-gray-800">
              {artistName()}
            </p>
          </div>
        </div>
        <div class="bg-pink-600"></div>
      </div>
    </div>
  );
};

export default AudioPlayer;
