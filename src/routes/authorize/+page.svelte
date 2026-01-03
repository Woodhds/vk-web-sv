<script lang="ts">
  import { authorize } from "./auth.remote";
  import { onMount } from "svelte";

  let { data } = $props();

  const redirectUrl = "https://api.vk.com/blank.html";

  onMount(() => {
    authorize.fields.redirectUri.set(redirectUrl);
  })

  const redirectToAuth = () => {
    window.open(
      `https://oauth.vk.com/authorize?client_id=${data.CLIENT_ID}&display=page&response_type=code&scope=111111111&redirect_uri=${redirectUrl}&v=5.199`,
      "_blank",
    );
  };
</script>

<form onsubmit={redirectToAuth}>
  <button type="submit" class="btn btn-primary">Получить код</button>
</form>

<form class="mt-4" {...authorize}>
  <input
    class="hidden"
    {...authorize.fields.redirectUri.as("text")}
  />
  <label class="form-control">
    Код
    <input
      {...authorize.fields.code.as("text")}
      class="input-sm input input-bordered input-primary w-full md:w-1/3"
    />
  </label>

  <button class="btn btn-primary" type="submit">Авторизоваться</button>
</form>

<svelte:head>
  <title>Authorize</title>
</svelte:head>
