<script>
  import { goto } from '$app/navigation';
  import { user, api, setToken } from '$lib/api.js';

  import LoginView from '$lib/views/LoginView.svelte';

  import Notification from '$lib/components/Notification.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import PostList from '$lib/components/PostList.svelte';

  import Logo from '$lib/icons/Logo.svelte';
  import SearchIcon from '$lib/icons/SearchIcon.svelte';
  import ScrollDownIcon from '$lib/icons/ScrollDownIcon.svelte';
  import DropBoxIcon from '$lib/icons/DropBoxIcon.svelte';
  import PencilIcon from '$lib/icons/PencilIcon.svelte';
  import ProfileIcon from '$lib/icons/ProfileIcon.svelte';
  import LogoutIcon from '$lib/icons/LogoutIcon.svelte';
  import { onMount } from 'svelte';

  let dropboxToggle = false;
  let modalToggle = false;
  let query = '';

  function search() {
    goto('/search?query=' + query);
  }

  onMount(async () => {
    if (api.defaults.headers.common['Authorization']) {
      const { data: response } = await api.get('/auth/me');

      user.set(response.content.user);
    }
  });

  const logout = () => {
    setToken(null);
    goto('/');
  };
</script>

<div class="w-full bg-white">
  <header class=" fixed w-full flex justify-end z-10">
    <div class=" py-[20px] px-[38px]">
      {#if $user}
        <button
          on:click={() => {
            dropboxToggle = !dropboxToggle;
          }}
          class=" relative text-[16px] text-black rounded-[9px] flex items-center space-x-1"
        >
          <p class="text-black text-[16px]">{$user.name}님</p>
          <div class="{dropboxToggle ? 'rotate-180' : 'rotate-0'} ">
            <DropBoxIcon />
          </div>
        </button>
        {#if dropboxToggle}
          <div
            class="absolute w-[96px] h-[100px] rounded-[10px] border border-[#D8D8D8] bg-white z-50 text-[13px] text-black flex flex-col justify-center pl-[11px] space-y-[13px]"
          >
            <button
              on:click={() => {
                dropboxToggle = false;
                goto('/write');
              }}
              class="flex items-center space-x-1"
            >
              <PencilIcon />
              <p>글 작성</p>
            </button>
            <button
              on:click={() => {
                dropboxToggle = false;
                goto('/my/posted');
              }}
              class="flex items-center space-x-1"
            >
              <ProfileIcon />
              <p>내 정보</p>
            </button>
            <button on:click={logout} class="flex items-center space-x-1">
              <LogoutIcon />
              <p>로그아웃</p>
            </button>
          </div>
        {/if}
      {:else}
        <button
          on:click={() => {
            modalToggle = true;
          }}
          class="bg-[#1A91FF] w-[73px] h-[30px] text-[16px] text-white rounded-[9px]"
        >
          시작하기
        </button>
      {/if}
    </div>
  </header>
  <main class="  w-full min-h-screen h-full flex flex-col items-center">
    <section class="relative w-full min-h-screen h-full flex flex-col items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="w-[192px] h-[81px]">
          <Logo />
        </div>
        <div class="sticky top-[4px] w-[525px] h-[44px] mt-[11px] items-center justify-between">
          <div class="relative w-[525px] h-[44px]">
            <input
              bind:value={query}
              on:keyup={(e) => {
                if (e.key === 'Enter') search();
              }}
              class=" absolute pl-[20px] text-[18px] border-[#C9C9C9] flex w-[525px] h-[44px] rounded-[20px] border"
            />
            <button class=" absolute right-[21px] top-1/2 -translate-y-1/2">
              <SearchIcon />
            </button>
          </div>
        </div>
        <p class="text-[18px] text-black mt-[21px]">
          <span class="text-[18px] text-[#1A91FF]">트리피</span>에서 새로운 여행 친구를
          만들어보세요!
        </p>
        <div class="absolute left-1/2 -translate-x-1/2 bottom-6 animate-bounce w-fit">
          <ScrollDownIcon />
        </div>
      </div>
    </section>
    <section class="w-full max-w-[1100px] mt-16">
      <p class="text-[33px] w-full text-center mb-[32px]">최신글 🌱</p>

      <PostList />
    </section>
  </main>
</div>
<Modal active={modalToggle} toggle={() => (modalToggle = false)}>
  <LoginView close={() => (modalToggle = false)} />
</Modal>
{#if $user}
  <Notification />
{/if}
