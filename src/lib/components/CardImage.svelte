<script lang="ts">
    let {images = $bindable(), key}: { images: string[], key: string } = $props();

    let imgs = $state([] as string[])

    let carousel: HTMLElement = null;
    $effect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {

                    imgs = [...images || []]
                    observer.disconnect()
                }
            })
        }, {
            threshold: 0.05
        })

        observer.observe(carousel)

        return () => {
            observer.disconnect()
        }
    })

</script>

<div bind:this={carousel} class="carousel">
    {#if imgs !== undefined && imgs !== null && imgs.length > 0}
        {#each imgs as image, i}
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

    {:else}
        <div class="carousel-item relative w-full">
            <svg height="300" width="400" viewBox="0 0 496.158 496.158">
                <use xlink:href="#no-photo"></use>
            </svg>
        </div>

    {/if}
</div>