<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import BookmarkIcon from '$lib/icons/BookmarkIcon.svelte';

  export let id;

  let bookmarked = false;

  onMount(async () => {
    const { data: response } = await api.get(`/post/saved`);

    response.content.posts.forEach((post) => {
      if (post.id === id) {
        bookmarked = true;
      }
    });
  });

  const onBookmarkClick = async () => {
    if (bookmarked) {
      await api.delete(`/post/${id}/save`);
      bookmarked = false;
    } else {
      await api.put(`/post/${id}/save`);
      bookmarked = true;
    }
  };
</script>

<button
  on:click={onBookmarkClick}
  class={`fixed right-[100px] bottom-[30px] rounded-full border w-[50px] h-[50px] ${bookmarked ? 'bg-yellow-300' : 'bg-white'}`}
>
  <div class="relative w-full h-full flex items-center justify-center">
    <BookmarkIcon />
  </div>
</button>
