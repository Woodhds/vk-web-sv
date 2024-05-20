<script lang="ts">
    import type {UserEntity} from "../../models/entities";

    const {data} = $props();

    let remove = async (id: number) => {
        await fetch('api/users/' + id, {
            method: 'DELETE',
        })

        this.data.users = this.data.users.filter((u: UserEntity) => u.id !== id)
    }

</script>

<div class="flex flex-col w-full lg:w-1/2 gap-6">
    {#if data }
        {#each data.users as user}
            <div class="flex gap-4 items-center">
                <a href="https://vk.com/id{user.id}" target="_blank">
                    <img alt="{user.name}" class="avatar rounded-full mr-3" src="{user.avatar}"/>
                    <span>{user.name}</span>
                </a>
                <button class="btn btn-circle btn-error btn-sm btn-ghost" onclick={() => remove(user.id)}>X</button>
            </div>
        {/each}
    {/if}
</div>