<script lang="ts">
    let {
        images = $bindable(),
        key = $bindable(),
    }: { images: string[]; key: string } = $props();
</script>

<div class="carousel">
    {#if images.length > 0}
        {#each images as image, i}
            <div
                id={key + "-" + i}
                class="carousel-item relative w-full justify-center"
            >
                <img
                    src={image}
                    class="rounded-2xl h-72 w-auto"
                    loading="lazy"
                    alt={key}
                />
                {#if images.length > 1}
                    <div
                        class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
                    >
                        <a
                            href="#{key + '-' + (i - 1)}"
                            class="btn btn-circle bg-transparent text-white"
                            >❮</a
                        >
                        <a
                            href="#{key + '-' + (i + 1)}"
                            class="btn btn-circle bg-transparent text-white"
                            >❯</a
                        >
                    </div>
                {/if}
            </div>
        {/each}
    {:else}
        <div class="carousel-item relative w-full justify-center">
            <svg height="300" width="400" viewBox="0 0 496.158 496.158">
                <use xlink:href="#no-photo"></use>
            </svg>
        </div>
    {/if}
</div>
