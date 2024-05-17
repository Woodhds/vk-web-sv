<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import type {VkMessage} from "../models/types";
    import {messages as storeMessages, isLoading} from '$lib/stores/message'
    import CardSkeleton from "$lib/components/CardSkeleton.svelte";

    let messages: VkMessage[] = $state([] as VkMessage[]);
    storeMessages.subscribe(val => {
        messages = [...val]
    })

    let isLoad = $state(false);
    isLoading.subscribe(val => isLoad = val)

</script>
<div class="grid grid-cols-3 gap-8">
    {#if !isLoad}
        {#each messages as _, i}
            <Card bind:message="{messages[i]}"/>
        {/each}
    {:else}
        {#each new Array(6) as _}
            <CardSkeleton/>
        {/each}

    {/if}
</div>