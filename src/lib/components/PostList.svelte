<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import PaidIcon from '$lib/icons/PaidIcon.svelte';

  export let posts = [];

  if (!$page.url.pathname.includes('search')) {
    (async () => {
      const { data: response } = await api.get(`/post`);
      posts = response.content.posts;
      if (posts) posts = posts.reverse();
    })();
  }
</script>

<div class="w-full grid grid-cols-3 justify-items-center justify-between gap-y-[75px]">
  {#each posts as post}
    <button
      on:click={() => {
        goto('/post/' + post.id);
      }}
      class="w-[296px]"
    >
      <img
        class="w-[296px] h-[221px] bg-zinc-200 rounded-[15px] object-cover"
        src={`/api/uploads/${post.backgroundImage.fileName}`}
        alt={post.title}
      />
      <div class="flex items-center mt-[9px]">
        <a href="/post/{post.id}">
          <p class="text-[22px]">
            {post.title}
          </p>
        </a>
        {#if post.paid}
          <div
            class="w-[17px] h-[17px] ml-1 rounded-full bg-[#1A91FF] flex justify-center items-center"
          >
            <PaidIcon />
          </div>
        {/if}
      </div>
      <p class="text-[13px] text-[#747474]">{post.introduce}</p>
    </button>
  {/each}
</div>
