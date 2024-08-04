<script lang="ts">
  import { musicManager } from "$lib/music-manager";
  import { trackToMusicTrack } from "$lib/utils";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<button
  onclick={() => {
    for (const track of data.tracks) {
      musicManager.addTrackToQueue(trackToMusicTrack(track));
    }
  }}>Add to Queue</button
>

{#each data.tracks as track}
  <p>{track.name}</p>
{/each}
