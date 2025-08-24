<script lang="ts">
  import Auth from "$lib/components/Auth.svelte";
  import Grab from "$lib/components/Grab.svelte";
  import { getMessages } from "$lib/stores/message.js";
  import { page } from "$app/state";

  const path = $derived(page.url.pathname);
  let search = $state("");

  const get = async () => {
    await getMessages(search);
  };
</script>

<nav class="bg-base-200 mb-6 sticky z-10 top-0">
  <div class="navbar navbar-expand-lg container mx-auto">
    <div class="navbar-start">
      <div class="dropdown lg:hidden">
        <div tabindex="0" role="button" class="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          role="menu"
          tabindex="0"
        >
          <li>
            <a
              class="btn"
              class:btn-ghost={path !== "/"}
              class:btn-primary={path === "/"}
              href="/">Главная</a
            >
          </li>
          <li>
            <a
              class="btn"
              class:btn-ghost={path !== "/users"}
              class:btn-primary={path === "/users"}
              href="/users">Пользователи</a
            >
          </li>
          <li>
            <a
              class="btn"
              class:btn-ghost={path !== "/authorize"}
              class:btn-primary={path === "/authorize"}
              href="/authorize">Авторизация</a
            >
          </li>
          <Grab />
        </ul>
      </div>

      <div class="lg:flex hidden">
        <a
          class="btn"
          class:btn-ghost={path !== "/"}
          class:btn-primary={path === "/"}
          href="/">Главная</a
        >
        <a
          class="btn"
          class:btn-ghost={path !== "/users"}
          class:btn-primary={path === "/users"}
          href="/users">Пользователи</a
        >
      </div>
    </div>
    {#if path === "/"}
      <div class="navbar-center">
        <form onsubmit={get} class="flex flex-col">
          <div class="join">
            <input
              bind:value={search}
              placeholder="Текст"
              class="input input-sm input-bordered input-primary join-item"
            />
            <button class="btn btn-primary btn-sm join-item">Поиск</button>
          </div>
        </form>
      </div>
    {/if}
    <Auth />
  </div>
</nav>
