<script lang="ts">
    export let images: string[];
    export let key: string;
</script>
{#if images !== undefined && images !== null && images.length > 0}
    <div class="carousel">

        {#each images as image, i}
            <div id="{key + '-' + i}" class="carousel-item relative w-full">
                <img src="{image}" class="rounded-2xl h-72 w-full"/>
                {#if images.length > 1}
                    <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a href="#{key + '-' + (i - 1)}" class="btn btn-circle bg-transparent text-white">❮</a>
                        <a href="#{key + '-' + (i + 1)}" class="btn btn-circle bg-transparent text-white">❯</a>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{:else}
    <div class="h-72">
        <svg height="300" width="400" viewBox="0 0 496.158 496.158">
            <use xlink:href="#no-photo"></use>
        </svg>
    </div>

{/if}