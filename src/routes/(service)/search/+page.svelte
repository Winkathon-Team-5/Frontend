<script>
  import PostList from '$lib/components/PostList.svelte';
  import { api } from '$lib/api.js';
  import { onMount } from 'svelte';

  export let data;
  let { query } = data;

  let posts = [];

  onMount(async () => {
    const { data: response } = await api.get(`/post`);

    posts = response.content.posts.filter((post) => post.title.includes(query));
  });
</script>

<section
  class="max-w-[1100px] relative w-full h-full flex flex-col items-center justify-center mt-[32px]"
>
  <PostList {posts} />
</section>
