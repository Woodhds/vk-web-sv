<script lang="ts">
  import { notifications } from "$lib/stores/notification";
</script>

<div class="toast toast-end">
  {#each $notifications as notification}
    <div
      class="alert"
      class:alert-error={notification.type === "error"}
      class:alert-info={notification.type === "info"}
      class:alert-warning={notification.type === "warning"}
      class:alert-success={notification.type === "success"}
    >
      <span>{notification.message}</span>
    </div>
  {/each}
</div>
