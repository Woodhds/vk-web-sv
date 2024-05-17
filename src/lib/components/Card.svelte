<script lang="ts">
    import type {VkMessage} from "../../models/types";
    import CardImage from "$lib/components/CardImage.svelte";
    import {repost as storeRepost, like as storeLike} from "$lib/stores/message";

    const {message = $bindable()} : {message: VkMessage} = $props()

    let key = $state(`${message.ownerId}_${message.id}`)

    const isNew = (Date.now() - Date.parse(message.parseDate)) / 1000 / 60 / 60 < 6

    const getText = (text: string) => {
        return text.replace(/\[((id|club)\d+)\|(.*?)\]/gm, `<a href="https://vk.com/$1" class="text-primary" target="_blank">$3</a>`)
    }

    let isLike = $state(false);

    let isRepost = $state(false);

    const repost = async () => {
        try {
            isRepost = true;

            await storeRepost(message.ownerId, message.id);
        } finally {
            isRepost = false;
        }
    }

    const like = async () => {
        try {
            isLike = true;
            await storeLike(message.ownerId, message.id)
        } finally {
            isLike = false;
        }
    }

</script>

<div class="card card-compact card-bordered bg-base-100">
    {#if isNew}
        <div class="indicator">
            <span class="indicator-item badge badge-primary">New</span>
        </div>
    {/if}

    <div class="card-body">
        <span class="card-title text-lg">
            <a href="https://vk.com/wall{message.ownerId}_{message.id}" title="{message.owner}"
               class="overflow-hidden text-ellipsis whitespace-nowrap" target="_blank">
                {message.owner}
            </a>
        </span>
        <div class="font-light">{new Date(message.date).toLocaleString()}</div>
        <CardImage images={message.images} key={key}/>
        <pre class="max-h-72 overflow-auto whitespace-pre-line text-wrap text-xs h-screen">
            {@html getText(message.text)}
        </pre>
        <div class="card-actions">
            <div class="card-actions">
                <button class="btn btn-sm btn-primary flex {message.userLikes ? '' : 'btn-outline'}" onclick={like}>
                    {#if isLike}
                        <span class="loading loading-ring"></span>
                    {:else}
                        <svg height="24" width="24" viewBox="0 0 24 24">
                            <use xlink:href="#like"></use>
                        </svg>
                    {/if}
                    {message.likesCount}
                </button>
                <button class="btn btn-sm btn-secondary flex {message.userReposted ? '' : 'btn-outline'}"
                        onclick={repost}>
                    {#if isRepost}
                        <span class="loading loading-ring"></span>
                    {:else}
                        <svg height="24" width="24" viewBox="0 0 24 24">
                            <use xlink:href="#repost"></use>
                        </svg>
                    {/if}
                    {message.repostsCount}
                </button>

            </div>
        </div>
    </div>
</div>