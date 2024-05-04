<script lang="ts">
    import type {VkMessage} from "../../models/types";
    import CardImage from "$lib/components/CardImage.svelte";

    export let message: VkMessage

    let key = `${message.ownerId}_${message.id}`
</script>

<div class="card card-compact card-bordered bg-base-100">
    <div class="card-body">
        <span class="card-title whitespace-nowrap text-ellipsis">
            <a href="https://vk.com/wall{message.ownerId}_{message.id}" target="_blank">
                {message.owner}
            </a>
        </span>
        <div class="font-light">{new Date(message.date).toLocaleString()}</div>
        <CardImage bind:images={message.images} bind:key={key}/>
        <pre class="max-h-72 overflow-auto flex-grow text-wrap">
            {message.text}
        </pre>
        <div class="card-actions">
            <div class="card-actions">
                <button class="btn btn-sm btn-primary flex {message.userLikes ? '' : 'btn-outline'}">
                    <svg height="24" width="24" viewBox="0 0 24 24">
                        <use xlink:href="#like"></use>
                    </svg>
                    {message.likesCount}
                </button>
                <button class="btn btn-sm btn-secondary flex {message.userReposted ? '' : 'btn-outline'}">
                    <svg height="24" width="24" viewBox="0 0 24 24">
                        <use xlink:href="#repost"></use>
                    </svg>
                    {message.repostsCount}
                </button>
            </div>
        </div>
    </div>

</div>