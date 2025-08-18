<script lang="ts">
  import { loadUsers, deleteUser } from "./data.remote";

  const users = loadUsers();
</script>

<div class="flex flex-col w-full lg:w-1/2 gap-6">
  {#if users.loading}
    {#each new Array(6) as _}
      <div class="skeleton w-full md:w-3/12 h-16"></div>
    {/each}
  {:else}
    {#each users.current as user}
      <form {...deleteUser} class="flex gap-4 items-center">
        <input type="hidden" name="id" value={user.id} />
        <a href="https://vk.com/id{user.id}" target="_blank">
          <img
            alt={user.name}
            class="avatar rounded-full mr-3 h-12 w-auto"
            src={user.avatar}
          />
          <span class="link link-hover link-primary">{user.name}</span>
        </a>
        <button
          aria-label="удалить"
          class="btn btn-circle text-error btn-sm btn-ghost"
        >
          <svg height="24" width="24" viewBox="200 200 1280 1280">
            <use xlink:href="#cross"></use>
          </svg>
        </button>
      </form>
    {/each}
  {/if}
  <a class="btn btn-primary lg:w-1/2" href="/users/add">Добавить</a>
</div>

<svelte:head>
  <title>Users</title>
</svelte:head>
