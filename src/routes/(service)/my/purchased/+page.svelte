<script>
  import { api } from '$lib/api.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let posts = [];

  onMount(async () => {
    const { data: response } = await api.get('/post/paid');

    posts = response.content?.posts;

    if (posts) posts = posts.reverse();
  });
</script>

{#each posts as post}
  <button
    on:click={() => goto('/post/' + post.id)}
    class="mt-5 w-[912px] h-[108px] rounded-[16px] border border-[#C9C9C9] px-[10px] py-[16px] flex justify-between"
  >
    <div class="flex flex-col text-left w-[680px]">
      <p class="text-black text-[18px] w-[680px] font-medium break-all">{post.title}</p>
      <p class="text-black text-[12px] w-[680px] break-all">{post.introduce}</p>
    </div>
    <img
      class="ml-[16px] h-20 w-32 object-cover"
      src={`/api/uploads/${post.backgroundImage.fileName}`}
      alt="post_image"
    />
  </button>
{/each}
