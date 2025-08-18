<script lang="ts">
  import { add as notificationAdd } from "$lib/stores/notification";
  import { addUser } from "./data.remote";

  const add = () => {
    notificationAdd("Добавлено");
  };
</script>

<form
  {...addUser.enhance(async ({ submit }) => {
    await submit();
    add();
  })}
  class="lg:w-1/3 flex flex-col gap-3"
>
  <input
    name="id"
    class="input input-bordered input-primary input-sm w-full"
    type="text"
    placeholder="Enter username"
  />
  <button class="btn btn-primary btn-sm">Добавить</button>
</form>

<svelte:head>
  <title>Users - Add</title>
</svelte:head>
