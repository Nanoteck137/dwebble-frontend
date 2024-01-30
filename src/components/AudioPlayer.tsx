import Slider from "@components/Slider";
import { createAudio } from "@solid-primitives/audio";
import {
  HiSolidBackward,
  HiSolidForward,
  HiSolidPause,
  HiSolidPlay,
} from "solid-icons/hi";
import {
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { musicManager, type Track } from "src/lib/MusicManager";

function formatTime(s: number) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);

  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function getVolume() {
  const volume = localStorage.getItem("player-volume");
  if (volume) {
    return parseFloat(volume);
  }

  return 1.0;
}

const TestAudioPlayer = () => {
  const [volume, setVolume] = createSignal(getVolume());

  const [time, setTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);

  const [state, setState] = createSignal<"loading" | "paused" | "playing">(
    "loading",
  );

  const [currentTrack, setCurrentTrack] = createSignal<Track | null>(null);
  const [src, setSrc] = createSignal("");
  const [{ player }, { play, pause, seek, setVolume: setPlayerVolume }] =
    createAudio(src);

  onMount(() => {
    player.preload = "auto";
    let unsub = musicManager.onQueueUpdated(() => {
      setCurrentTrack(musicManager.getCurrentTrack());
      play();
    });
    onCleanup(() => {
      unsub();
    });
  });

  createEffect(() => {
    setPlayerVolume(volume());
  });

  createEffect(() => {
    if (currentTrack()) {
      setSrc(currentTrack()!.src);
    } else {
      setSrc("");
    }
  });

  player.addEventListener("timeupdate", () => {
    setTime(player.currentTime);
    setDuration(player.duration);
  });

  player.addEventListener("durationchange", () => {
    setDuration(player.duration);
  });
  player.addEventListener("volumechange", () => {});
  player.addEventListener("loadstart", () => {
    setState("loading");
  });
  player.addEventListener("loadeddata", () => {
    setState("paused");
  });
  player.addEventListener("timeupdate", () => {
    setTime(player.currentTime);
    setDuration(player.duration);
  });
  player.addEventListener("playing", () => {
    setState("playing");
  });
  player.addEventListener("pause", () => {
    setState("paused");
  });
  player.addEventListener("ended", () => {
    musicManager.next();
  });

  return (
    <div class="relative flex h-full items-center gap-4">
      <div class="flex gap-2">
        <button
          onClick={() => {
            musicManager.prev();
            play();
          }}
        >
          <HiSolidBackward size="30" />
        </button>
        <button
          onClick={() => {
            switch (state()) {
              case "playing":
                pause();
                break;
              case "paused":
                play();
                break;
            }
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
        <button
          onClick={() => {
            musicManager.next();
            play();
          }}
        >
          <HiSolidForward size="30" />
        </button>
      </div>
      <p>
        {formatTime(time())} / {formatTime(duration())}
      </p>

      <div class="flex flex-col">
        <p class="">{currentTrack() ? currentTrack()!.title : "No track"}</p>
        {/* <p class="text-sm">
          {queue().items.length > 0
            ? queue().items[queue().index].artistName
            : ""}
        </p> */}
      </div>

      <Slider
        class="w-48"
        progress={volume()}
        onInteract={(p) => {
          setVolume(p);
          localStorage.setItem("player-volume", p.toString());
        }}
      />

      <div class="absolute -left-4 -right-4 -top-2">
        <Slider
          progress={time() / duration()}
          onInteract={(p) => {
            seek(p * duration());
            seek(p * duration());
            seek(p * duration());
            seek(p * duration());
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

export default TestAudioPlayer;
