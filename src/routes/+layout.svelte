<script lang="ts">
  import {
    DiscAlbum,
    FileMusic,
    Home,
    ListMusic,
    LogOut,
    Menu,
    User,
    Users,
  } from "lucide-svelte";
  import "../app.css";
  import AudioPlayer from "$lib/components/AudioPlayer.svelte";
  import Link from "$lib/components/Link.svelte";
  import { browser } from "$app/environment";

  let { children, data } = $props();

  let showSideMenu = $state(false);

  function close() {
    showSideMenu = false;
  }

  $effect(() => {
    if (showSideMenu) {
      if (browser) document.body.style.overflow = "hidden";
    } else {
      if (browser) document.body.style.overflow = "";
    }
  });
</script>

<header class="flex h-16 items-center gap-4 bg-[--bg-color] px-4 py-2">
  <button
    onclick={() => {
      showSideMenu = true;
    }}
  >
    <Menu size="32" />
  </button>

  <a class="text-3xl font-medium text-[--logo-color]" href="/">Dwebble</a>
</header>

<main>
  {@render children()}
</main>

<footer>
  <AudioPlayer />
</footer>

{#if showSideMenu}
  <button
    class="absolute inset-0 z-50 bg-[--modal-overlay-bg]"
    onclick={() => {
      showSideMenu = false;
    }}
  ></button>
{/if}

<aside
  class={`fixed bottom-0 top-0 z-50 flex w-80 flex-col bg-[--bg-color] px-4 text-[--fg-color] transition-transform duration-300 ${showSideMenu ? "translate-x-0" : "-translate-x-[100%]"}`}
>
  <div class="flex h-16 items-center gap-4 px-2 py-2">
    <button
      onclick={() => {
        showSideMenu = false;
      }}
    >
      <Menu size="32" />
    </button>
    <a
      class="text-3xl font-medium text-[--logo-color]"
      href="/"
      onclick={() => {
        showSideMenu = false;
      }}
    >
      Dwebble
    </a>
  </div>

  <div class="flex flex-col gap-2 py-2">
    <Link title="Home" href="/" icon={Home} onClick={close} />
    <Link title="Artists" href="/artists" icon={Users} onClick={close} />
    <Link title="Albums" href="/albums" icon={DiscAlbum} onClick={close} />
    <Link title="Tracks" href="/tracks" icon={FileMusic} onClick={close} />

    {#if data.user}
      <Link
        title="Playlists"
        href="/playlists"
        icon={ListMusic}
        onClick={close}
      />
    {/if}
  </div>
  <div class="flex-grow"></div>
  <div class="flex flex-col gap-2 py-4">
    {#if data.user}
      <Link
        title={data.user.username}
        href="/account"
        icon={User}
        onClick={close}
      />

      <form class="w-full" action="/logout" method="POST">
        <Link title="Logout" icon={LogOut} onClick={close} />
      </form>
    {/if}
  </div>
</aside>
