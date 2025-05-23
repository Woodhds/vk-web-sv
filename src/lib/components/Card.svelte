<script lang="ts">
  import type { VkMessage } from "src/models/types";
  import CardImage from "$lib/components/CardImage.svelte";
  import {
    repost as storeRepost,
    like as storeLike,
  } from "$lib/stores/message";
  import { user } from "$lib/stores/user";

  const { message = $bindable() }: { message: VkMessage } = $props();

  let key = $state(`${message.ownerId}_${message.id}`);

  const isNew =
    (Date.now() - Date.parse(message.parseDate)) / 1000 / 60 / 60 < 6;

  const getText = (text: string) => {
    return text
      .replace(
        /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
        `<a href="$1" class="link-primary" target="_blank">$1</a>`,
      )
      .replace(
        /\[((id|club)\d+)\|(.*?)\]/gm,
        `<a href="https://vk.com/$1" class="link-primary" target="_blank">$3</a>`,
      );
  };

  let isLike = $state(false);

  let isRepost = $state(false);

  let isComment = $state(false);

  const repost = async () => {
    try {
      isRepost = true;

      await storeRepost(
        message.ownerId,
        message.id,
        message.ownerId < 0 ? [-message.ownerId] : [],
        $user.accessToken,
      );
    } finally {
      isRepost = false;
    }
  };

  const like = async () => {
    try {
      isLike = true;
      await storeLike(message.ownerId, message.id, $user.accessToken);
    } finally {
      isLike = false;
    }
  };

  const participate = async (comment: string) => {
    try {
      isComment = true;

      await fetch("api/messages/comment", {
        method: "POST",
        body: JSON.stringify({
          owner_id: message.ownerId,
          post_id: message.id,
          comment,
          access_token: $user.accessToken,
        }),
      });
    } finally {
      isComment = false;
    }
  };
</script>

<div class="card card-compact card-bordered bg-base-100">
  {#if isNew}
    <div class="indicator">
      <span class="indicator-item badge badge-primary">New</span>
    </div>
  {/if}

  <div class="card-body">
    <span class="card-title text-lg">
      <a
        href="https://vk.com/wall{message.ownerId}_{message.id}"
        title={message.owner}
        class="overflow-hidden text-ellipsis whitespace-nowrap"
        target="_blank"
      >
        {message.owner}
      </a>
    </span>
    <div class="font-light">{new Date(message.date).toLocaleString()}</div>
    <CardImage images={message.images} {key} />
    <pre
      class="max-h-64 overflow-auto whitespace-pre-line text-wrap text-xs h-screen">
            {@html getText(message.text)}
        </pre>
    <div class="card-actions flex-1">
      <button
        class:btn-outline={!message.userLikes}
        class="btn btn-sm btn-primary flex"
        onclick={like}
      >
        {#if isLike}
          <span class="loading loading-ring"></span>
        {:else}
          <svg height="24" width="24" viewBox="0 0 24 24">
            <use xlink:href="#like"></use>
          </svg>
        {/if}
        {message.likesCount}
      </button>
      <button
        class:btn-outline={!message.userReposted}
        class="btn btn-sm btn-secondary flex"
        onclick={repost}
      >
        {#if isRepost}
          <span class="loading loading-ring"></span>
        {:else}
          <svg height="24" width="24" viewBox="0 0 24 24">
            <use xlink:href="#repost"></use>
          </svg>
        {/if}
        {message.repostsCount}
      </button>
      <div class="flex flex-1 justify-end">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-sm btn-ghost">
            <svg height="16" width="16" viewBox="0 0 16 16">
              <use xlink:href="#dots-vertical"></use>
            </svg>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            {#if isComment}
              <li class="text-center">
                <span class="loading loading-ring"></span>
              </li>
            {:else}
              <li>
                <button onclick={() => participate("Участвую")}>Участвую</button
                >
              </li>
            {/if}
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
