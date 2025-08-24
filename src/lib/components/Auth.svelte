<script lang="ts">
  import { page } from "$app/state";
  import { getCurrentUser, logout } from "../../routes/authorize/auth.remote";
  import { add } from "$lib/stores/notification";
  import Grab from "./Grab.svelte";

  const currentUser = getCurrentUser();
  const path = $derived(page.url.pathname);

  const logOutEnhanced = async () => {
    await logout();
    add("Log out success", "success");
  };
</script>

<div class="navbar-end hidden lg:flex">
  {#if currentUser.loading}
    <div class="skeleton w-16 h-10"></div>
  {:else if currentUser.current}
    {@const user = currentUser.current}
    <div class="dropdown dropdown-start">
      <div tabindex="0" role="button" class="flex items-center btn btn-ghost">
        <span
          class="tooltip tooltip-bottom mr-2"
          data-tip={user.first_name + " " + user.last_name}
        >
          <img
            class="h-8 avatar rounded-full"
            src={user.photo_50}
            alt="avatar"
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
        <Grab />
        <li>
          <button onclick={() => logOutEnhanced()} class="btn btn-secondary"
            >Выход</button
          >
        </li>
      </ul>
    </div>
  {:else}
    <a
      class="btn"
      class:btn-ghost={path !== "/authorize"}
      class:btn-primary={path === "/authorize"}
      href="/authorize">Авторизация</a
    >
  {/if}
</div>
