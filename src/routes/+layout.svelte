<script lang="ts">
  import "../app.css";
  import AudioPlayer from "../components/AudioPlayer.svelte";

  let { children, data } = $props();
</script>

<div>
  <header class="flex h-12 gap-4 bg-purple-300">
    {#if data.user}
      <p>{data.user.username}</p>

      <form action="/logout" method="POST">
        <button type="submit">Logout</button>
      </form>
    {/if}
  </header>

  <main>
    {@render children()}
  </main>

  <footer>
    <AudioPlayer />
  </footer>
</div>
