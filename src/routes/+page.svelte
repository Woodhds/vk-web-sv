<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import type {VkMessage} from "../models/types";
    import {messages as storeMessages} from '$lib/stores/message'

    let messages: VkMessage[] = [];
    storeMessages.subscribe(val => {
        messages = [...val]
    })

</script>
<div class="grid grid-cols-3 gap-8 mt-8">
    {#each messages as i}
        <Card bind:message="{i}"/>
    {/each}
</div>