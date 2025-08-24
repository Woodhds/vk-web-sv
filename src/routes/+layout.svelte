<script lang="ts">
  import Icons from "$lib/components/Icons.svelte";

  import "../app.css";
  import { type Snippet } from "svelte";
  import Notifications from "$lib/components/Notifications.svelte";
  import Header from "$lib/components/Header.svelte";

  let hidden = $state(true);

  const addScroll = () => {
    const scrollHeight = document.documentElement.scrollTop;
    if (scrollHeight > 200) {
      if (hidden == true) {
        hidden = false;
      }
    } else if (hidden == false) {
      hidden = true;
    }
  };

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let { children }: { children: Snippet } = $props();
</script>

<Icons />
<Header />

<div class="container m-auto">
  {@render children()}
</div>

<Notifications />

<svelte:document on:scroll={addScroll} />

<div class="fixed bottom-8 right-8" class:hidden>
  <button
    aria-label="Наверх"
    class="btn btn-circle btn-primary"
    onclick={toTop}
  >
    <svg height="24" width="24" viewBox="0 0 24 24">
      <use xlink:href="#top"></use>
    </svg>
  </button>
</div>
