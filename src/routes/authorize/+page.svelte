<script lang="ts">
  import type { VkAuthorizeResponse } from "src/models/types";
  import { auth } from "$lib/stores/user";
  import { add } from "$lib/stores/notification";
  import { enhance } from "$app/forms";
  import { authorize, getCurrentUser } from "./auth.remote";
  import { onMount } from "svelte";

  let { data } = $props();

  const redirectUrl = "https://api.vk.com/blank.html";

  const onSuccess = async ({ form }) => {
    form.reset();

    const data = await getCurrentUser();

    if (data?.id) {
      auth({
        id: data.id,
        avatar: data.avatar,
        name: data.name,
      });

      add("Authentication success", "success");
    }
  };

  const redirectToAuth = () => {
    window.open(
      `https://oauth.vk.com/authorize?client_id=${data.CLIENT_ID}&display=page&response_type=code&scope=111111111&redirect_uri=${redirectUrl}l&v=5.199`,
      "_blank",
    );
  };
</script>

<form onsubmit={redirectToAuth}>
  <button type="submit" class="btn btn-primary">Получить код</button>
</form>

<form class="mt-4" {...authorize.enhance(onSuccess)}>
  <input type="hidden" name="redirect_uri" value={redirectUrl} />
  <label class="form-control">
    Код
    <input
      name="code"
      class="input-sm input input-bordered input-primary w-full md:w-1/3"
    />
  </label>

  <button class="btn btn-primary" type="submit">Авторизоваться</button>
</form>

<svelte:head>
  <title>Authorize</title>
</svelte:head>
