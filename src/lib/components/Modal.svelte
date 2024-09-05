<script>
  import CloseIcon from '$lib/icons/CloseIcon.svelte';

  export let active = false;
  export let toggle = () => {};
</script>

{#if active}
  <div class=" fixed w-full h-full bg-black z-10 top-0 left-0 bg-opacity-20">
    <div
      class=" relative w-[300px] rounded-[20px] flex flex-col items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white drop-shadow-sm"
    >
      <button on:click={toggle} class="absolute right-[17px] top-[17px]">
        <CloseIcon />
      </button>
      <slot />
    </div>
  </div>
{/if}
