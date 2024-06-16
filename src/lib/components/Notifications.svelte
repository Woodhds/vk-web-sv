<script lang="ts">
  import { add, notifications } from "$lib/stores/notification";
</script>

<div class="toast toast-end">
  {#each $notifications as notification}
    <div class="alert alert-info">
      <span>{notification}</span>
    </div>
  {/each}
</div>