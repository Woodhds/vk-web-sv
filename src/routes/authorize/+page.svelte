<script lang="ts">
  import type { VkAuthorizeResponse } from "../../models/types";
  import { auth, logOut } from "$lib/stores/user";

  let code = $state("");
  const redirectUrl = "https://api.vk.com/blank.html";

  const authorize = () => {
    window.open(`https://oauth.vk.com/authorize?client_id=5662498&display=page&response_type=code&scope=111111111&redirect_uri=${redirectUrl}l&v=5.199`, "_blank");
  };

  const getToken = async () => {
    const response = await fetch("api/authorize", {
      method: "POST",
      body: JSON.stringify({ code, redirectUrl })
    });

    const data = await response.json() as VkAuthorizeResponse;

    if (data?.access_token) {
      auth(
        {
          accessToken: data.access_token,
          avatar: data.avatar,
          name: data.name,
          expiresIn: data.expires_in
        });
    }
  };
</script>

<form onsubmit={authorize}>
  <button type="submit" class="btn btn-primary">
    Авторизоваться
  </button>
</form>

<form class="mt-3" onsubmit={getToken}>
  <label class="form-control">
    Код
    <input bind:value={code} class="input-sm input input-bordered input- input-primary w-full md:w-1/3" />
  </label>

  <button class="btn btn-primary mt-3" type="submit">
    Получить токен
  </button>
</form>

<form class="mt-3" onsubmit={logOut}>
  <button type="submit" class="btn btn-secondary">
    Выход
  </button>
</form>