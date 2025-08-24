<script lang="ts">
  import { grabData } from "../../routes/grab.remote";

  let isLoading = $state(false);

  const grab = async () => {
    isLoading = true;
    try {
      await grabData();
    } finally {
      isLoading = false;
    }
  };
</script>

<li>
  {#if isLoading}
    {@render loading()}
  {:else}
    <button onclick={() => grab()} class="btn btn-ghost"> Получить </button>
  {/if}
</li>

{#snippet loading()}
  <div class="px-5 flex justify-center">
    <span class="loading loading-ring bg-primary"></span>
  </div>
{/snippet}
