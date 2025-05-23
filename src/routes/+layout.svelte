<script lang="ts">
  import Icons from "$lib/components/Icons.svelte";
  import {
    getMessages,
    grab,
    isGrab as isGrabStore,
  } from "$lib/stores/message.js";
  import { page } from "$app/state";
  import "../app.css";
  import { onMount, type Snippet } from "svelte";
  import { getUser, logOut as storeLogout, user } from "$lib/stores/user";
  import Notifications from "$lib/components/Notifications.svelte";
  import { add } from "$lib/stores/notification";

  let isGrab = $state(false);
  isGrabStore.subscribe((val) => (isGrab = val));

  const get = async () => {
    await getMessages(search, $user.accessToken);
  };

  const collect = async () => {
    await grab($user.accessToken);
  };

  const logOut = () => {
    storeLogout();
    add("Log out success", "success");
  };

  let hidden = $state(true);

  const addScroll = () => {
    const scrollHeight = document.documentElement.scrollTop;
    if (scrollHeight > 200) {
      if (hidden == true) {
        hidden = false;
      }
    } else if (hidden == false) {
      hidden = true;
    }
  };

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let search = $state("");

  let { children }: { children: Snippet } = $props();

  onMount(() => getUser());
</script>

<Icons />

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
              class:btn-ghost={page.url.pathname !== "/"}
              class:btn-primary={page.url.pathname === "/"}
              href="/">Главная</a
            >
          </li>
          <li>
            <a
              class="btn"
              class:btn-ghost={page.url.pathname !== "/users"}
              class:btn-primary={page.url.pathname === "/users"}
              href="/users">Пользователи</a
            >
          </li>
          <li>
            <a
              class="btn"
              class:btn-ghost={page.url.pathname !== "/authorize"}
              class:btn-primary={page.url.pathname === "/authorize"}
              href="/authorize">Авторизация</a
            >
          </li>
          <li>
            {#if isGrab}
              <div class="px-5">
                <span class="loading loading-ring bg-primary"></span>
              </div>
            {:else}
              <button onclick={collect} class="btn btn-ghost">
                Получить
              </button>
            {/if}
          </li>
        </ul>
      </div>

      <div class="lg:flex hidden">
        <a
          class="btn"
          class:btn-ghost={page.url.pathname !== "/"}
          class:btn-primary={page.url.pathname === "/"}
          href="/">Главная</a
        >

        <a
          class="btn"
          class:btn-ghost={page.url.pathname !== "/users"}
          class:btn-primary={page.url.pathname === "/users"}
          href="/users">Пользователи</a
        >
      </div>
    </div>
    {#if page.url.pathname === "/"}
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

    <div class="navbar-end hidden lg:flex">
      {#if $user}
        <div class="dropdown dropdown-start">
          <div
            tabindex="0"
            role="button"
            class="flex items-center btn btn-ghost"
          >
            <span class="tooltip tooltip-bottom mr-2" data-tip={$user.name}>
              <img
                class="h-8 avatar rounded-full"
                src={$user.avatar}
                alt={$user.name}
              />
            </span>
            <svg class="rotate-180" height="10" width="10" viewBox="0 0 24 24">
              <use xlink:href="#top"></use>
            </svg>
          </div>
          <ul
            tabindex="1"
            class="dropdown-content menu p-2 bg-base-100 rounded-t-none min-w-32 z-10"
          >
            <li>
              {#if isGrab}
                <div class="px-5 flex justify-center">
                  <span class="loading loading-ring bg-primary"></span>
                </div>
              {:else}
                <a onclick={collect} class="btn btn-ghost">Получить</a>
              {/if}
            </li>
            <li>
              <a onclick={logOut} class="btn btn-secondary">Выход</a>
            </li>
          </ul>
        </div>
      {:else}
        <a
          class="btn"
          class:btn-ghost={page.url.pathname !== "/authorize"}
          class:btn-primary={page.url.pathname === "/authorize"}
          href="/authorize">Авторизация</a
        >
      {/if}
    </div>
  </div>
</nav>

<div class="container m-auto">
  {@render children()}
</div>

<Notifications />

<svelte:document on:scroll={addScroll} />

<div class="fixed bottom-8 right-8" class:hidden>
  <button class="btn btn-circle btn-primary" onclick={toTop}>
    <svg height="24" width="24" viewBox="0 0 24 24">
      <use xlink:href="#top"></use>
    </svg>
  </button>
</div>
