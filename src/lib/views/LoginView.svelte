<script>
	import Cookies from 'js-cookie';
	import Logo from '$lib/Logo.svelte';
	import SignUpView from '$lib/views/SignUpView.svelte';
	import { api, user, setToken } from '$lib/api.js';
	import { goto } from '$app/navigation';

	let is_signup = false;

	let id = '';
	let password = '';

	const login = async () => {
		const res = await api.post('/auth/login', {id, password});

		if (res) {
			if (res.data.error) {
				alert(res.data.error);
				return;
			}

			const { accessToken, refreshToken } = res.data.content;

			setToken(accessToken, refreshToken);

			const res2 = await api.get('/auth/me');

			$user = res2.data.content;

			alert('로그인 성공');
		}
	};
</script>

{#if !is_signup}
	<div class=" w-[135px] mt-[35px]">
		<Logo />
	</div>
	<div class=" flex flex-col mt-[6px]">
		<p class="text-[10px] text-black mb-[3px]  ml-2">아이디</p>
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
			class="w-[244px] h-[32px] text-[14px] bg-[#D9D9D9] text-[#616161] rounded-[10px] mt-[27px]"
			on:click={login}
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
	<SignUpView />
{/if}
