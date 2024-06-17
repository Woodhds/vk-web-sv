<script lang="ts">
  import type { VkAuthorizeResponse } from "src/models/types";
  import { auth } from "$lib/stores/user";
  import { add } from "$lib/stores/notification";

  let { data } = $props();
  
  let code = $state("");
  const redirectUrl = "https://api.vk.com/blank.html";

  const authorize = () => {
    window.open(
      `https://oauth.vk.com/authorize?client_id=${data.CLIENT_ID}&display=page&response_type=code&scope=111111111&redirect_uri=${redirectUrl}l&v=5.199`,
      "_blank",
    );
  };

  const getToken = async () => {
    try {
      const response = await fetch("api/authorize", {
        method: "POST",
        body: JSON.stringify({ code, redirectUrl }),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        const { message } = responseJson as { message: string };
        add(message, "error");
        return;
      }

      const data = responseJson as VkAuthorizeResponse;

      if (data?.access_token) {
        auth({
          accessToken: data.access_token,
          avatar: data.avatar,
          name: data.name,
          expiresIn: data.expires_in,
        });

        add('Authentication success', 'success')
      }
    } finally {
      code = '';
    }
  };
</script>

<form onsubmit={authorize}>
  <button type="submit" class="btn btn-primary">Получить код</button>
</form>

<form class="mt-3" onsubmit={getToken}>
  <label class="form-control">
    Код
    <input
      bind:value={code}
      class="input-sm input input-bordered input- input-primary w-full md:w-1/3"
    />
  </label>

  <button class="btn btn-primary mt-3" type="submit">Авторизоваться</button>
</form>

<svelte:head>
  <title>Authorize</title>
</svelte:head>
