import { AudioState, createAudio } from "@solid-primitives/audio";
import { BiRegularSkipNext, BiRegularSkipPrevious } from "solid-icons/bi";
import {
  HiSolidChevronDown,
  HiSolidChevronUp,
  HiSolidPause,
  HiSolidPlay,
  HiSolidQueueList,
  HiSolidSpeakerWave,
  HiSolidSpeakerXMark,
} from "solid-icons/hi";
import {
  Component,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { useMusicManager } from "~/context/MusicManager";
import LoadingSpinner from "~/lib/components/LoadingSpinner";
import Slider from "~/lib/components/Slider";
import { formatTime } from "~/lib/utils";

type PlayerProps = {
  state: AudioState;
  currentTime: number;
  duration: number;

  audioMuted: boolean;

  coverArt: string;
  trackName: string;
  artistName: string;

  onSeek: (n: number) => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;

  onPlay: () => void;
  onPause: () => void;
};

const LargePlayer: Component<PlayerProps> = (props) => {
  return (
    <div class="fixed bottom-0 left-0 right-0 z-30 hidden h-20 bg-purple-400 md:block">
      <div class="relative">
        <Slider
          initialValue={0}
          value={props.currentTime / props.duration}
          onUpdate={(p) => {
            props.onSeek(p * props.duration);
          }}
        />
      </div>

      <div class="grid h-full grid-cols-footer">
        <div class="flex items-center bg-cyan-600">
          <div class="flex items-center">
            <button
              onClick={() => {
                props.onPrevTrack();
                // musicManager.prevTrack();
                // controls.play();
              }}
            >
              <BiRegularSkipPrevious size={48} />
            </button>

            <Switch
              fallback={
                <>
                  <button onClick={() => props.onPlay()}>
                    <HiSolidPlay size={48} />
                  </button>
                </>
              }
            >
              <Match when={props.state == "playing"}>
                <button onClick={() => props.onPause()}>
                  <HiSolidPause size={48} />
                </button>
              </Match>
              <Match when={props.state == "paused" || props.state == "ready"}>
                <button onClick={() => props.onPlay()}>
                  <HiSolidPlay size={48} />
                </button>
              </Match>
              <Match when={props.state == "loading"}>
                <LoadingSpinner />
              </Match>
            </Switch>
            <button
              onClick={() => {
                props.onNextTrack();
              }}
            >
              <BiRegularSkipNext size={48} />
            </button>
          </div>

          <p class="hidden min-w-20 text-xs font-medium lg:block">
            {formatTime(props.currentTime)} /{" "}
            {formatTime(Number.isNaN(props.duration) ? 0 : props.duration)}
          </p>
        </div>

        <div class="flex items-center justify-center gap-2 bg-amber-600 align-middle">
          <img
            class="aspect-square h-12 rounded object-cover"
            src={props.coverArt}
            alt="Cover Art"
          />
          <div class="flex flex-col">
            <p class="line-clamp-1 text-ellipsis" title={props.trackName}>
              {props.trackName}
            </p>

            <p class="line-clamp-1 min-w-80 text-ellipsis text-sm text-gray-800">
              {props.artistName}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-evenly bg-violet-500">
          <div class="relative flex w-24 translate-y-1.5 items-center">
            <Slider
              initialValue={getVolume()}
              onUpdate={(p) => {
                // if (!muted()) {
                //   setVolume(p);
                // }
                // localStorage.setItem("player-volume", p.toString());
              }}
            />
          </div>
          <button
            onClick={() => {
              // const res = setMuted((prev) => !prev);
              // localStorage.setItem("player-muted", res.toString());
            }}
          >
            <Show
              when={props.audioMuted}
              fallback={<HiSolidSpeakerWave size={24} />}
            >
              <HiSolidSpeakerXMark size={24} />
            </Show>
          </button>
          {/* <button onClick={() => setShowPlayQueue(true)}> */}
          <button>
            <HiSolidQueueList size={24} />
          </button>
        </div>
      </div>

      {/* <PlayQueue
        isOpen={showPlayQueue()}
        close={() => setShowPlayQueue(false)}
      /> */}
    </div>
  );
};

const SmallPlayer: Component<PlayerProps> = (props) => {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <div
        class={`fixed bottom-0 left-0 right-0 z-30 h-16 bg-gray-200 transition-transform duration-300 md:hidden ${open() ? "translate-y-[100%]" : ""}`}
      >
        <div class="flex items-center">
          <Show
            when={props.state === "playing"}
            fallback={
              <button class="p-4" onClick={() => props.onPlay()}>
                <HiSolidPlay class="h-8 w-8" />
              </button>
            }
          >
            <button class="p-4" onClick={() => props.onPause()}>
              <HiSolidPause class="h-8 w-8" />
            </button>
          </Show>
          <div class="flex grow items-center" onClick={() => setOpen(true)}>
            <img
              class="aspect-square h-16 rounded object-cover p-1"
              src={props.coverArt}
              alt="Cover Art"
            />
            <div class="flex flex-col justify-center px-2">
              <p class="line-clamp-1">{props.trackName}</p>
              <p class="line-clamp-1">{props.artistName}</p>
            </div>
            <div class="flex-grow"></div>
            <div class="flex h-16 min-w-16 items-center justify-center">
              <HiSolidChevronUp class="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
      <div
        class={`fixed left-0 right-0 top-0 h-screen bg-white transition-transform duration-300 md:hidden ${open() ? "" : "translate-y-[100%]"}`}
      >
        <div class="relative flex flex-col items-center justify-center gap-2">
          <div
            class="flex h-12 w-full items-center bg-gray-200"
            onClick={() => setOpen(false)}
          >
            <div class="w-2"></div>
            <button
              class="rounded-full p-2 hover:bg-black/70"
              onClick={() => setOpen(false)}
            >
              <HiSolidChevronDown class="h-6 w-6" />
            </button>
          </div>
          <img
            class="aspect-square w-80 rounded object-cover"
            src={props.coverArt}
            alt="Track Cover Art"
          />
          <p class="text-lg font-medium">{props.trackName}</p>
          <p class="">{props.artistName}</p>
          <div class="flex items-center gap-4">
            <button
              onClick={() => {
                props.onPrevTrack();
              }}
            >
              <BiRegularSkipPrevious class="h-12 w-12" />
            </button>

            <Switch
              fallback={
                <>
                  <button
                    class="rounded-full bg-white p-3"
                    onClick={() => props.onPlay()}
                  >
                    <HiSolidPlay class="h-12 w-12" />
                  </button>
                </>
              }
            >
              <Match when={props.state == "playing"}>
                <button
                  class="rounded-full bg-white p-3"
                  onClick={() => props.onPause()}
                >
                  <HiSolidPause class="h-12 w-12" />
                </button>
              </Match>
              <Match when={props.state == "paused" || props.state == "ready"}>
                <button
                  class="rounded-full bg-white p-3"
                  onClick={() => props.onPlay()}
                >
                  <HiSolidPlay class="h-12 w-12" />
                </button>
              </Match>
              <Match when={props.state == "loading"}>
                <LoadingSpinner />
              </Match>
            </Switch>

            <button
              onClick={() => {
                props.onNextTrack();
              }}
            >
              <BiRegularSkipNext class="h-12 w-12" />
            </button>
          </div>

          <div class="relative h-4 w-full">
            <Slider
              initialValue={0}
              value={props.currentTime / props.duration}
              onUpdate={(p) => {
                props.onSeek(p * props.duration);
              }}
            />
          </div>

          <p>
            {formatTime(props.currentTime)} /{" "}
            {formatTime(Number.isNaN(props.duration) ? 0 : props.duration)}
          </p>
        </div>
      </div>
    </>
  );
};

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
    <>
      <LargePlayer
        state={audio.state}
        currentTime={audio.currentTime}
        duration={audio.duration}
        audioMuted={muted()}
        coverArt={coverArtUrl()}
        trackName={trackName()}
        artistName={artistName()}
        onSeek={(n: number) => {
          controls.seek(n);
        }}
        onPrevTrack={() => {
          musicManager.prevTrack();
          controls.play();
        }}
        onNextTrack={() => {
          musicManager.nextTrack();
          controls.play();
        }}
        onPlay={() => {
          controls.play();
        }}
        onPause={() => {
          controls.pause();
        }}
      />

      <SmallPlayer
        state={audio.state}
        currentTime={audio.currentTime}
        duration={audio.duration}
        audioMuted={muted()}
        coverArt={coverArtUrl()}
        trackName={trackName()}
        artistName={artistName()}
        onSeek={(n: number) => {
          controls.seek(n);
        }}
        onPrevTrack={() => {
          musicManager.prevTrack();
          controls.play();
        }}
        onNextTrack={() => {
          musicManager.nextTrack();
          controls.play();
        }}
        onPlay={() => {
          controls.play();
        }}
        onPause={() => {
          controls.pause();
        }}
      />
    </>
  );
};

export default AudioPlayer;
