<script lang="ts">
  import { onMount } from "svelte";
  import { formatTime } from "$lib/utils";
  import { musicManager } from "$lib/music-manager";
  import LargePlayer from "$lib/components/audio/LargePlayer.svelte";
  import SmallPlayer from "$lib/components/audio/SmallPlayer.svelte";

  let loading = $state(false);
  let playing = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let volume = $state(0);

  let trackName = $state("");
  let artistName = $state("");
  let coverArt = $state("");

  let audio: HTMLAudioElement;

  onMount(() => {
    audio = new Audio();

    audio.addEventListener("canplay", () => {
      console.log("canplay");
      loading = false;
    });

    audio.addEventListener("loadstart", () => {
      console.log("loadstart");
      loading = true;
    });

    audio.addEventListener("loadedmetadata", () => {
      console.log("loadedmetadata");
      currentTime = audio.currentTime;
      duration = audio.duration;
    });

    audio.addEventListener("progress", () => {
      console.log("progress");
    });

    audio.addEventListener("timeupdate", () => {
      currentTime = audio.currentTime;
    });

    audio.addEventListener("loadeddata", () => {
      console.log("loadeddata");
    });

    audio.addEventListener("playing", () => {
      console.log("playing");
      playing = true;
    });

    audio.addEventListener("pause", () => {
      console.log("pause");
      playing = false;
    });

    audio.addEventListener("load", () => {
      console.log("load");
    });

    audio.addEventListener("volumechange", () => {
      volume = audio.volume;
    });

    volume = audio.volume;

    musicManager.emitter.on("onTrackChanged", () => {
      const track = musicManager.getCurrentTrack();
      console.log(track);
      if (track) {
        trackName = track.name;
        artistName = track.artistName;
        coverArt = track.coverArt;
        // setTrackName(track.name);
        // setTrackSource(track.source);
        // setArtistName(track.artistName);
        // setCoverArtUrl(track.coverArt);
        audio.src = track.source;
      } else {
        trackName = "";
        artistName = "";

        audio.removeAttribute("src");
        audio.load();
        // setTrackName("");
        // setTrackSource("");
        // setArtistName("");
        // setCoverArtUrl("");
        // audio.player.removeAttribute("src");
        // audio.player.load();
      }
    });

    musicManager.emitter.on("requestPlay", () => {
      audio.play();
    });

    musicManager.emitter.on("requestPause", () => {
      audio.pause();
    });

    musicManager.emitter.on("requestPlayPause", () => {
      if (playing) {
        audio.pause();
      } else {
        audio.play();
      }
    });
  });
</script>

<LargePlayer
  {playing}
  {loading}
  {trackName}
  {artistName}
  {coverArt}
  {currentTime}
  {duration}
  {volume}
  onPlay={() => {
    audio.play();
  }}
  onPause={() => {
    audio.pause();
  }}
  onNextTrack={() => {
    musicManager.nextTrack();
    audio.play();
  }}
  onPrevTrack={() => {
    musicManager.prevTrack();
    audio.play();
  }}
  onSeek={(e) => {
    audio.currentTime = e;
  }}
  onVolumeChanged={(e) => {
    audio.volume = e;
  }}
/>

<SmallPlayer
  {playing}
  {loading}
  {trackName}
  {artistName}
  {coverArt}
  {currentTime}
  {duration}
  {volume}
  onPlay={() => {
    audio.play();
  }}
  onPause={() => {
    audio.pause();
  }}
  onNextTrack={() => {
    musicManager.nextTrack();
    audio.play();
  }}
  onPrevTrack={() => {
    musicManager.prevTrack();
    audio.play();
  }}
  onSeek={(e) => {
    audio.currentTime = e;
  }}
  onVolumeChanged={(e) => {
    audio.volume = e;
  }}
/>

<!-- <div
  class="fixed bottom-0 left-0 right-0 flex h-14 items-center gap-4 bg-red-300 px-2"
>
  <div class="flex gap-2">
    <button
      onclick={() => {
        musicManager.prevTrack();
        musicManager.requestPlay();
      }}>Prev</button
    >

    {#if loading}
      <p>Loading...</p>
    {:else if playing}
      <button
        onclick={() => {
          musicManager.requestPause();
        }}>Pause</button
      >
    {:else}
      <button
        onclick={() => {
          musicManager.requestPlay();
        }}>Play</button
      >
    {/if}

    <button
      onclick={() => {
        musicManager.nextTrack();
        musicManager.requestPlay();
      }}>Next</button
    >
  </div>

  <div class="flex flex-col">
    <p class="text-sm">{trackName}</p>
    <p class="text-xs">{artistName}</p>
  </div>

  <p>{formatTime(currentTime)} / {formatTime(duration)}</p>
</div> -->
