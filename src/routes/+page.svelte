<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import type { VkMessage } from "../models/types";
  import { messages as storeMessages, isLoading } from "$lib/stores/message";
  import CardSkeleton from "$lib/components/CardSkeleton.svelte";

  let messages: VkMessage[] = $state([] as VkMessage[]);
  storeMessages.subscribe((val) => {
    messages = [...val];
  });

  let isLoad = $state(false);
  isLoading.subscribe((val) => (isLoad = val));
</script>

<div
  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-0 md:gap-x-4"
>
  {#if !isLoad}
    {#each messages as mes (`${mes.ownerId}_${mes.id}`)}
      <Card message={mes} />
    {/each}
  {:else}
    {#each new Array(6) as _}
      <CardSkeleton />
    {/each}
  {/if}
</div>

<svelte:head>
  <title>Competitions</title>
</svelte:head>
