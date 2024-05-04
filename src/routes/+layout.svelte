<script lang="ts">
    import '../app.css'
    import Icons from "$lib/components/Icons.svelte";
    import {getMessages} from "$lib/stores/message.js";

    const grab = () => {

    }

    const get = async () => {
        await getMessages(search)
    }

    let search: string = ''
</script>

<Icons/>
<div class="container mx-auto">
    <nav class="navbar navbar-expand-lg bg-base-200">
        <div class="navbar-start">
            <a class="btn btn-ghost" href="/">Главная</a>
            <a class="btn btn-ghost" href="/about">Пользователи</a>
        </div>
        <div class="navbar-center">
            <form on:submit={get} class="flex flex-col mt-3 lg:w-1/3">
                <div class="join">
                    <input bind:value={search} placeholder="Текст" class="input input-sm input-bordered input-primary join-item"/>
                    <button class="btn btn-primary btn-sm join-item">Поиск</button>
                </div>
            </form>
        </div>
        <div class="navbar-end">
            <button class="btn btn-ghost" on:click={grab}>Получить</button>
        </div>
    </nav>
    <slot/>
</div>