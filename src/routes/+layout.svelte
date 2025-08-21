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
  import {
    logOut as storeLogout,
    user,
    auth,
    type UserState,
  } from "$lib/stores/user";
  import Notifications from "$lib/components/Notifications.svelte";
  import { add } from "$lib/stores/notification";
  import { getCurrentUser, logout } from "./authorize/auth.remote";
  import { grabData } from "./grab.remote";

  let isGrab = $state(false);
  isGrabStore.subscribe((val) => (isGrab = val));

  const get = async () => {
    await getMessages(search);
  };

  const logOut = (data: { submit: Function }) => {
    storeLogout(data.submit);
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

  onMount(async () => {
    $inspect.trace("onMount");
    const user = await getCurrentUser();
    auth({
      avatar: user.photo_50,
      name: user.first_name + " " + user.last_name,
    } as UserState);
  });
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
            <form {...grabData.enhance(grab)}>
              <button class="btn btn-ghost">
                {@render loading(isGrab)}
                {#if !isGrab}
                  Получить
                {/if}
              </button>
            </form>
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
            tabindex="0"
            role="menu"
            class="dropdown-content menu p-2 bg-base-100 rounded-t-none min-w-32 z-10"
          >
            <li>
              <form {...grabData.enhance(grab)}>
                <button class="btn btn-ghost">
                  {@render loading(isGrab)}
                  {#if !isGrab}
                    Получить
                  {/if}
                </button>
              </form>
            </li>
            <li>
              <form {...logout.enhance(logOut)}>
                <button class="btn btn-secondary">Выход</button>
              </form>
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
  <button
    aria-label="Наверх"
    class="btn btn-circle btn-primary"
    onclick={toTop}
  >
    <svg height="24" width="24" viewBox="0 0 24 24">
      <use xlink:href="#top"></use>
    </svg>
  </button>
</div>

{#snippet loading(isLoading: boolean)}
  {#if isLoading}
    <div class="px-5 flex justify-center">
      <span class="loading loading-ring bg-primary"></span>
    </div>
  {/if}
{/snippet}
