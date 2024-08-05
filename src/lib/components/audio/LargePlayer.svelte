<script lang="ts">
  import { formatTime } from "$lib/utils";
  import { Logs, Pause, Play, SkipBack, SkipForward } from "lucide-svelte";

  export let loading: boolean;
  export let playing: boolean;
  export let currentTime: number;
  export let duration: number;
  export let trackName: string;
  export let artistName: string;
  export let coverArt: string;

  export let onPlay: () => void;
  export let onPause: () => void;
  export let onNextTrack: () => void;
  export let onPrevTrack: () => void;
</script>

<div
  class="fixed bottom-0 left-0 right-0 z-30 hidden h-20 bg-purple-400 md:block"
>
  <div class="relative">
    <!-- <Slider
          initialValue={0}
          value={props.currentTime / props.duration}
          onUpdate={(p) => {
            props.onSeek(p * props.duration);
          }}
        /> -->
  </div>

  <div class="grid-cols-footer grid h-full">
    <div class="flex items-center bg-cyan-600">
      <div class="flex items-center">
        <button
          onclick={() => {
            onPrevTrack();
          }}
        >
          <SkipBack size="30" />
        </button>

        {#if loading}
          <p>Loading...</p>
        {:else if playing}
          <button onclick={onPause}>
            <Pause size={38} />
          </button>
        {:else}
          <button onclick={onPlay}>
            <Play size={38} />
          </button>
        {/if}

        <button
          onclick={() => {
            onNextTrack();
          }}
        >
          <SkipForward size="30" />
        </button>
      </div>

      <p class="hidden min-w-20 text-xs font-medium lg:block">
        {formatTime(currentTime)} /{" "}
        {formatTime(Number.isNaN(duration) ? 0 : duration)}
      </p>
    </div>

    <div
      class="flex items-center justify-center gap-2 bg-amber-600 align-middle"
    >
      <img
        class="aspect-square h-12 rounded object-cover"
        src={coverArt}
        alt="Cover Art"
      />
      <div class="flex flex-col">
        <p class="line-clamp-1 text-ellipsis" title={trackName}>
          {trackName}
        </p>

        <p class="line-clamp-1 min-w-80 text-ellipsis text-sm text-gray-800">
          {artistName}
        </p>
      </div>
    </div>
    <div class="flex items-center justify-evenly bg-violet-500">
      <div class="relative flex w-24 translate-y-1.5 items-center">
        <!-- <Slider
          initialValue={getVolume()}
          onUpdate={(p) => {
            // if (!muted()) {
            //   setVolume(p);
            // }
            // localStorage.setItem("player-volume", p.toString());
          }}
        /> -->
      </div>
      <button
        onclick={() => {
          // const res = setMuted((prev) => !prev);
          // localStorage.setItem("player-muted", res.toString());
        }}
      >
        <!-- <HiSolidSpeakerWave size={24} /> -->
        <!-- <Show when={props.audioMuted}>
          <HiSolidSpeakerXMark size={24} />
        </Show> -->
      </button>
      <button>
        <Logs size="24" />
      </button>
    </div>
  </div>
</div>
