<script lang="ts">
    import Icons from "$lib/components/Icons.svelte";
    import {getMessages, grab, isGrab as isGrabStore} from "$lib/stores/message.js";
    import {page} from "$app/stores"
    import '../app.css';
    import type {Snippet} from "svelte";

    let isGrab = $state(false);
    isGrabStore.subscribe(val => isGrab = val)

    const get = async () => {
        await getMessages(search)
    }

    let hidden = $state(true);

    $effect(() => {
        window.addEventListener("scroll", () => {
            const scrollHeight = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollHeight > 200) {
                if (hidden == true) {
                    hidden = false;
                }
            } else if (hidden == false) {
                hidden = true;
            }
        });
    })

    const toTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }

    let search = $state('')

    let {children}: {children: Snippet} = $props();
</script>

<Icons/>
<div class="container mx-auto">
    <nav class="navbar navbar-expand-lg bg-base-200 mb-8">
        <div class="navbar-start">
            <a class="btn" class:btn-ghost={$page.url.pathname !== '/'} class:btn-primary="{$page.url.pathname === '/'}"
               href="/">Главная</a>

            <a class="btn" class:btn-ghost={$page.url.pathname !== '/users'}
               class:btn-primary="{$page.url.pathname === '/users'}"
               href="/users">Пользователи</a>
        </div>
        {#if $page.url.pathname === '/'}
            <div class="navbar-center">
                <form onsubmit={get} class="flex flex-col lg:w-1/3">
                    <div class="join">
                        <input bind:value={search} placeholder="Текст"
                               class="input input-sm input-bordered input-primary join-item"/>
                        <button class="btn btn-primary btn-sm join-item">Поиск</button>
                    </div>
                </form>
            </div>
        {/if}
        <div class="navbar-end">
            <form onsubmit={grab}>
                <button class="btn btn-ghost">
                    Получить
                    {#if isGrab}
                        <span class="loading loading-ring"></span>
                    {/if}
                </button>
            </form>
        </div>
    </nav>
    {@render children()}
</div>


<div class="fixed bottom-8 right-8" class:hidden={hidden}>
    <button class="btn btn-circle btn-primary" onclick={toTop}>
        <svg height="24" width="24" viewBox="0 0 24 24">
            <use xlink:href="#top"></use>
        </svg>
    </button>
</div>