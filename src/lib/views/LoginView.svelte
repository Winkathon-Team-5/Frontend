<script>
  import Logo from '$lib/icons/Logo.svelte';
  import SignUpView from '$lib/views/SignUpView.svelte';
  import { api, user, setToken } from '$lib/api.js';

  let id = '';
  let password = '';
  let is_signup = false;
  let active_login_button = false;

  export let close = () => {};

  const login = async () => {
    const res = await api.post('/auth/login', { id, password });

    const { accessToken } = res.data.content;
    setToken(accessToken);

    const res2 = await api.get('/auth/me');
    $user = res2.data.content.user;

    close();
  };

  function activateLogin() {
    active_login_button = password !== '' && id !== '';
  }
</script>

<svelte:window
  on:input={() => {
    activateLogin();
  }}
/>

{#if !is_signup}
  <div class=" w-[135px] mt-[35px]">
    <Logo />
  </div>
  <div class=" flex flex-col mt-[6px]">
    <p class="text-[10px] text-black mb-[3px] ml-2">아이디</p>
    <input
      class="w-[244px] h-[34px] rounded-[12px] text-[11px] px-[12px] border border-[#C9C9C9] mb-[7px]"
      placeholder="아이디를 입력해주세요"
      bind:value={id}
    />
    <p class="text-[10px] text-black mb-[3px] ml-2">비밀번호</p>
    <input
      type="password"
      class="w-[244px] h-[34px] rounded-[12px] text-[11px] px-[12px] border border-[#C9C9C9]"
      placeholder="비밀번호를 입력해주세요"
      bind:value={password}
    />
    <button
      on:click={login}
      disabled={!active_login_button}
      class="w-[244px] h-[32px] text-[14px]
         {active_login_button ? 'bg-[#1A91FF] text-white' : 'bg-[#D9D9D9] text-[#616161]'}
         rounded-[10px] my-[27px]"
    >
      로그인
    </button>
    <button
      on:click={() => (is_signup = true)}
      class="text-[#1A91FF] text-[10px] w-full text-right mb-[19px] mt-[6px]"
      >계정이 없으신가요? 지금 회원가입 하세요!</button
    >
  </div>
{:else}
  <SignUpView {close} />
{/if}
