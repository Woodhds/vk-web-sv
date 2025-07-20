<script lang="ts">
  import { user } from "$lib/stores/user";
  import { add as notificationAdd } from "$lib/stores/notification";
  let search = $state("");

  const add = async () => {
    await fetch("/api/users/add", {
      body: JSON.stringify({ id: +search, access_token: $user.accessToken }),
      method: "POST",
    });

    notificationAdd('Добавлено')
  };
</script>

<form>
  <label class="form-control">
    <input
      bind:value={search}
      class="input input-sm input-bordered input-primary join-item"
      type="text"
      placeholder="Enter username"
    />
  </label>
  <button class="btn btn-primary btn-sm join-item" onclick={add}
    >Добавить</button
  >
</form>
