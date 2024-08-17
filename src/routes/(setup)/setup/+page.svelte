<script lang="ts">
  type Page = "user-creation" | "finish";
  let page: Page = "user-creation";

  function nextPage() {
    switch (page) {
      case "user-creation":
        page = "finish";
    }
  }
</script>

<form class="flex flex-col gap-6" method="POST">
  {#if page === "user-creation"}
    <div class="flex flex-col">
      <div class="flex flex-col gap-1">
        <label class="text-sm uppercase tracking-wide" for="username">
          Username
        </label>
        <input
          class="border-1 h-12 rounded-[50px] border-[--input-border-color] bg-[--input-bg-color] px-5 text-[--input-fg-color] placeholder:text-[--input-placeholder-color] focus:border-[--input-focus-border-color] focus:ring-0"
          id="username"
          name="username"
          type="text"
          placeholder="Username"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm uppercase tracking-wide" for="password">
          Password
        </label>
        <input
          class="border-1 h-12 rounded-[50px] border-[--input-border-color] bg-[--input-bg-color] px-5 text-[--input-fg-color] placeholder:text-[--input-placeholder-color] focus:border-[--input-focus-border-color] focus:ring-0"
          id="password"
          name="password"
          type="text"
          placeholder="Password"
        />
      </div>

      <button
        class="button-primary w-fit rounded px-4 py-2"
        type="button"
        onclick={() => {
          page = "finish";
        }}>Next Page</button
      >
    </div>
  {/if}

  {#if page === "finish"}
    <div class="flex flex-col">
      <p class="text-xl">Setup Summary</p>
    </div>
  {/if}
</form>
