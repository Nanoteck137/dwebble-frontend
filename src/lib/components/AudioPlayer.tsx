import { createAudio } from "@solid-primitives/audio";
import { BiRegularSkipNext, BiRegularSkipPrevious } from "solid-icons/bi";
import {
  HiSolidPause,
  HiSolidPlay,
  HiSolidQueueList,
  HiSolidSpeakerWave,
  HiSolidSpeakerXMark,
} from "solid-icons/hi";
import {
  Match,
  Switch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { useMusicManager } from "~/context/MusicManager";
import LoadingSpinner from "~/lib/components/LoadingSpinner";
import PlayQueue from "~/lib/components/PlayQueue";
import Slider from "~/lib/components/Slider";
import { formatTime } from "~/lib/utils";

function getVolume() {
  const vol = localStorage.getItem("player-volume");
  if (vol) {
    return parseFloat(vol);
  }

  return 1.0;
}

function getMuted() {
  const muted = localStorage.getItem("player-muted");
  return muted == "true";
}

const AudioPlayer = () => {
  const [trackSource, setTrackSource] = createSignal("");
  const [trackName, setTrackName] = createSignal("");
  const [artistName, setArtistName] = createSignal("");
  const [coverArtUrl, setCoverArtUrl] = createSignal("");
  const [updatedServer, setUpdatedServer] = createSignal(false);

  const [volume, setVolume] = createSignal(getVolume());
  const [muted, setMuted] = createSignal(getMuted());
  const [audio, controls] = createAudio(trackSource, undefined, volume);

  const [showPlayQueue, setShowPlayQueue] = createSignal(false);

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
      if (track) {
        setTrackName(track.name);
        setTrackSource(track.source);
        setArtistName(track.artistName);
        setCoverArtUrl(track.coverArt);
      } else {
        setTrackName("");
        setTrackSource("");
        setArtistName("");
        setCoverArtUrl("");

        audio.player.removeAttribute("src");
        audio.player.load();
      }
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

  createEffect(() => {
    if (muted()) {
      controls.setVolume(0);
    } else {
      const vol = getVolume();
      controls.setVolume(vol);
    }
  });

  return (
    <div class="relative h-full">
      <Slider
        initialValue={0}
        value={audio.currentTime / audio.duration}
        onUpdate={(p) => {
          controls.seek(p * audio.duration);
        }}
      />

      <div class="grid h-full grid-cols-footer">
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

          <p class="hidden min-w-20 text-xs font-medium lg:block">
            {formatTime(audio.currentTime)} /{" "}
            {formatTime(Number.isNaN(audio.duration) ? 0 : audio.duration)}
          </p>
        </div>

        <div class="flex items-center justify-center gap-2 bg-amber-600 align-middle">
          <img
            class="aspect-square h-12 rounded object-cover"
            src={coverArtUrl()}
            alt="Cover Art"
          />
          <div class="flex flex-col">
            <p class="line-clamp-1 text-ellipsis" title={trackName()}>
              {trackName()}
            </p>

            <p class="line-clamp-1 min-w-80 text-ellipsis text-sm text-gray-800">
              {artistName()}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-evenly bg-violet-500">
          <div class="relative flex w-24 translate-y-1.5 items-center">
            <Slider
              initialValue={getVolume()}
              onUpdate={(p) => {
                if (!muted()) {
                  setVolume(p);
                }
                localStorage.setItem("player-volume", p.toString());
              }}
            />
          </div>
          <button
            onClick={() => {
              const res = setMuted((prev) => !prev);
              localStorage.setItem("player-muted", res.toString());
            }}
          >
            <Switch>
              <Match when={!muted()}>
                <HiSolidSpeakerWave size={24} />
              </Match>
              <Match when={muted()}>
                <HiSolidSpeakerXMark size={24} />
              </Match>
            </Switch>
          </button>
          <button onClick={() => setShowPlayQueue(true)}>
            <HiSolidQueueList size={24} />
          </button>
        </div>
      </div>

      <PlayQueue
        isOpen={showPlayQueue()}
        close={() => setShowPlayQueue(false)}
      />
    </div>
  );
};

export default AudioPlayer;
