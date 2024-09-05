<script>
  import Logo from '$lib/icons/Logo.svelte';
  import { api } from '$lib/api.js';

  let name = '';
  let id = '';
  let password = '';
  let check_password = '';
  let is_available = 0;
  let active_signup_button = false;

  export let close = () => {};

  const register = async () => {
    await api.post('/auth/register', { id, name, password });

    alert('회원가입 성공');

    close();
  };

  const preRegister = async () => {
    const res = await api.post(`/auth/pre-register/${id}`);
    is_available = res.data.content.exists ? -1 : 1;

    activateButton();
  };

  const activateButton = () => {
    active_signup_button =
      password !== '' && id !== '' && name !== '' && check_password === password && !!is_available;
  };
</script>

<svelte:window
  on:input={() => {
    activateButton();
  }}
/>

<div class=" w-[135px] mt-[35px]">
  <Logo />
</div>
<div class=" flex flex-col mt-[6px]">
  <p class="text-[10px] text-black mb-[3px] ml-2">이름</p>
  <input
    bind:value={name}
    class="w-[244px] h-[34px] rounded-[12px] text-[11px] px-[12px] border border-[#C9C9C9] mb-[7px]"
    placeholder="이름을 입력해주세요"
  />
  <p class="text-[10px] text-black mb-[3px] ml-2">아이디</p>
  <div class="relative w-[244px] h-[34px]">
    <input
      bind:value={id}
      disabled={is_available > 0}
      class="w-[244px] h-[34px] rounded-[12px] text-[11px] px-[12px] border border-[#C9C9C9] mb-[7px]"
      placeholder="아이디를 입력해주세요"
    />
    <button
      on:click={preRegister}
      disabled={is_available > 0 || !id}
      class=" absolute right-[12px] font-thin text-[10px] py-[2px] px-[5px]
            {id ? 'text-white bg-[#1A91FF]' : 'text-[#616161] bg-[#D9D9D9]'}
              rounded-[5px] top-1/2 -translate-y-1/2"
    >
      중복 확인
    </button>
  </div>
  {#if is_available === 1}
    <p class="my-[5px] text-[8px] text-right w-full text-[#1A91FF]">사용 가능한 아이디입니다.</p>
  {:else if is_available === -1}
    <p class="my-[5px] text-[8px] text-right w-full text-[#FF1A1A]">사용 불가능한 아이디입니다.</p>
  {:else if is_available === 0}
    <div class="h-[21px]" />
  {/if}
  <p class="text-[10px] text-black mb-[3px] ml-2">비밀번호</p>
  <input
    bind:value={password}
    type="password"
    class="w-[244px] h-[34px] rounded-[12px] text-[11px] px-[12px] border border-[#C9C9C9] mb-[7px]"
    placeholder="비밀번호를 입력해주세요"
  />
  <p class="text-[10px] text-black mb-[3px] ml-2">비밀번호 확인</p>
  <input
    bind:value={check_password}
    type="password"
    class="w-[244px] h-[34px] rounded-[12px] text-[11px] px-[12px] border border-[#C9C9C9]"
    placeholder="비밀번호를 입력해주세요"
  />
  <button
    on:click={register}
    disabled={!active_signup_button}
    class="w-[244px] h-[32px] text-[14px]
         {active_signup_button ? 'bg-[#1A91FF] text-white' : 'bg-[#D9D9D9] text-[#616161]'}

         rounded-[10px] my-[27px]"
  >
    회원가입
  </button>
</div>
