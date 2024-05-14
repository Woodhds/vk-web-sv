<script lang="ts">
    import type {PageData} from './$types';
    import type {UserEntity} from "../../models/entities";

    export let data: PageData;

    let remove = async (id: number) => {
        await fetch('api/users/' + id, {
            method: 'DELETE',
        })

        this.data.users = this.data.users.filter((u: UserEntity) => u.id !== id)
    }

</script>

<div class="flex flex-col w-full lg:w-1/2 gap-6">
    {#each data.users as user}
        <a class="flex gap-4 items-center" href="https://vk.com/id{user.id}" target="_blank">
            <img alt="{user.name}" class="avatar rounded-full" src="{user.avatar}"/>
            <div>{user.name}</div>
            <button class="btn btn-circle btn-error btn-sm btn-ghost" on:click={() => remove(user.id)}>X</button>
        </a>
    {/each}
</div>