<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user } from '$lib/api.js';
  import SettingIcon from '$lib/icons/SettingIcon.svelte';

  let profile_image = '/profile.png';
  let changed_password_toggle = false;
  let profile_setting_toggle = false;

  let current = $page.url.pathname;
  $: {
    current = $page.url.pathname;
  }
</script>

<div class="flex w-full h-full">
  <div class="w-[217px] min-h-screen h-full flex flex-col items-center border-r border-[#C9C9C9]">
    <div class="w-[179px] flex items-center justify-between my-[14px]">
      <div class="flex space-x-[5px] items-center">
        <img
          class="w-[36px] h-[36px] rounded-full"
          alt="profile"
          src={$user?.avatar ? `/api/uploads/${$user?.avatar?.fileName}` : '/profile.png'}
        />
        <p class="text-black text-[24px]">{$user?.name}</p>
      </div>
      <button
        on:click={() => {
          profile_setting_toggle = true;
          changed_password_toggle = false;
        }}
      >
        <SettingIcon />
      </button>
    </div>
    <div
      class="flex flex-col w-full text-[18px] text-black *:w-[206px] *:h-[38px] *:text-left items-center *:px-[14px] *:rounded-[10px] space-y-[1px]"
    >
      <button
        on:click={() => goto('/my/posted')}
        class={current === '/my/posted' ? 'bg-[#EDEDED]' : 'hover:bg-[#EDEDED]'}>작성글</button
      >
      <button
        on:click={() => goto('/my/purchased')}
        class={current === '/my/purchased' ? 'bg-[#EDEDED]' : 'hover:bg-[#EDEDED]'}
        >구매 목록</button
      >
      <button
        on:click={() => goto('/my/bookmarked')}
        class={current === '/my/bookmarked' ? 'bg-[#EDEDED]' : 'hover:bg-[#EDEDED]'}
        >저장 목록</button
      >
    </div>
  </div>
  <div class="w-full h-full flex flex-col items-center py-[45px]"><slot /></div>
</div>

{#if profile_setting_toggle}
  <div class=" fixed w-full h-full bg-black z-10 top-0 left-0 bg-opacity-20">
    <div
      class=" p-[20px] relative w-[300px] rounded-[20px] flex flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white drop-shadow-sm"
    >
      {#if changed_password_toggle}
        <p class="text-[22px] text-black w-full">비밀번호 변경</p>
      {:else}
        <p class="text-[22px] text-black w-full">내 프로필</p>
        <div class="flex w-full items-center mt-[13px]">
          <img class="w-[50px] h-[50px] rounded-full" alt="profile" src={profile_image} />
          <div class="flex flex-col ml-[8px]">
            <input
              disabled={true}
              bind:value={$user.name}
              class="text-black text-[22px] bg-transparent outline-none ring-0"
              maxlength="10"
            />
            <p class="text-[14px] text-black">
              {$user.userId}
            </p>
          </div>
        </div>
        <button
          on:click={() => {
            changed_password_toggle = false;
          }}
          class=" w-fit text-[12px] mt-[12px] mb-[17px] text-[#0085FF]"
          >비밀번호 변경
        </button>
        <button
          on:click={() => {
            profile_setting_toggle = false;
          }}
          class=" absolute right-[13px] bottom-[13px] text-[12px] mt-[12px] text-white w-[49px] text-center rounded-[5px] bg-[#0085FF]"
          >완료
        </button>
      {/if}
    </div>
  </div>
{/if}
