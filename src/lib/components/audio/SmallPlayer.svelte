<script lang="ts">
  import Slider from "$lib/components/Slider.svelte";
  import { formatTime } from "$lib/utils";
  import {
    ChevronDown,
    ChevronUp,
    Pause,
    Play,
    SkipBack,
    SkipForward,
  } from "lucide-svelte";

  let open = false;

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
  export let onSeek: (e) => void;
</script>

<div
  class={`fixed bottom-0 left-0 right-0 z-30 h-16 bg-[--bg-color-alt] text-[--fg-color] transition-transform duration-300 md:hidden ${open ? "translate-y-[100%]" : ""}`}
>
  <div class="flex items-center">
    <!-- <button class="p-4" onClick={() => props.onPlay()}>
                <HiSolidPlay class="h-8 w-8" />
              </button> -->
    <!-- <Show when={props.state === "playing"}>
      <button class="p-4" onclick={() => onPause()}>
        <Pause size="30" />
      </button>
    </Show> -->
    <div class="flex grow items-center">
      <img
        class="aspect-square h-16 rounded object-cover p-1"
        src={coverArt}
        alt="Cover Art"
      />
      <div class="flex flex-col justify-center px-2">
        <p class="line-clamp-1">{trackName}</p>
        <p class="line-clamp-1">{artistName}</p>
      </div>
      <div class="flex-grow"></div>
      <button
        class="flex h-16 min-w-16 items-center justify-center"
        onclick={() => {
          open = true;
        }}
      >
        <ChevronUp size="30" />
      </button>
    </div>
  </div>
</div>
<div
  class={`fixed left-0 right-0 top-0 h-screen bg-[--bg-color] transition-transform duration-300 md:hidden ${open ? "" : "translate-y-[100%]"}`}
>
  <div class="relative flex flex-col items-center justify-center gap-2">
    <div class="flex h-12 w-full items-center">
      <div class="w-2"></div>
      <button
        class="rounded-full p-2 hover:bg-black/70"
        onclick={() => {
          open = false;
        }}
      >
        <ChevronDown size="30" />
      </button>
    </div>
    <img
      class="aspect-square w-80 rounded object-cover"
      src={coverArt}
      alt="Track Cover Art"
    />
    <p class="text-lg font-medium">{trackName}</p>
    <p class="">{artistName}</p>
    <div class="flex items-center gap-4">
      <button
        onclick={() => {
          onPrevTrack();
        }}
      >
        <SkipBack size="30" />
      </button>

      <!-- <button
                    class="button-primary rounded-full p-3"
                    onClick={() => props.onPlay()}
                  >
                    <HiSolidPlay class="h-12 w-12" />
                  </button> -->

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

    <div class="relative h-4 w-full">
      <!-- <Slider
        initialValue={0}
        value={props.currentTime / props.duration}
        onUpdate={(p) => {
          props.onSeek(p * props.duration);
        }}
      /> -->

      <div class="w-1/2">
        <Slider
          value={currentTime / duration}
          onValue={(e) => onSeek(e * duration)}
        />
      </div>
    </div>

    <p>
      {formatTime(currentTime)} /{" "}
      {formatTime(Number.isNaN(duration) ? 0 : duration)}
    </p>
  </div>
</div>
