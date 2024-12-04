<script lang="ts">
  import type { UserEntity } from "src/models/entities";

  const { data } = $props();

  let remove = async (id: number) => {
    await fetch("api/users/" + id, {
      method: "DELETE",
    });

    this.data.users = this.data.users.filter((u: UserEntity) => u.id !== id);
  };
</script>

<div class="flex flex-col w-full lg:w-1/2 gap-6">
  {#await data.users}
    {#each new Array(6) as _}
      <div class="skeleton w-full md:w-3/12 h-16"></div>
    {/each}
  {:then result}
    {#each result as user}
      <div class="flex gap-4 items-center">
        <a href="https://vk.com/id{user.id}" target="_blank">
          <img
            alt={user.name}
            class="avatar rounded-full mr-3 h-12 w-auto"
            src={user.avatar}
          />
          <span class="link link-hover link-primary">{user.name}</span>
        </a>
        <button
          class="btn btn-circle text-error btn-sm btn-ghost"
          onclick={() => remove(user.id)}
        >
          <svg height="24" width="24" viewBox="200 200 1280 1280">
            <use xlink:href="#cross"></use>
          </svg>
        </button>
      </div>
    {/each}
  {/await}
</div>

<svelte:head>
  <title>Users</title>
</svelte:head>
