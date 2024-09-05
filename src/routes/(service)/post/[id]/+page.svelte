<script>
  import { marked } from 'marked';
  import LockIcon from '$lib/icons/LockIcon.svelte';
  import { api, user } from '$lib/api.js';
  import { onMount } from 'svelte';
  import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
  import Bookmark from '$lib/components/Bookmark.svelte';
  import { goto } from '$app/navigation';
  import Comment from '$lib/components/Comment.svelte';

  export let data;
  const { postId } = data;

  let fetched = true;
  let is_owner = false;
  let title = '';
  let content = [];
  let introduce = '';
  let price = '0';
  let is_paid = true;
  let background_image = '';
  let author = '';
  let created_at = new Date();
  let is_purchased = false;

  marked.use({
    breaks: true,
    gfm: true,
  });

  onMount(async () => {
    const { data: response } = await api.get(`/post/${postId}`);
    const post = response.content.post;

    const raw_content = JSON.parse(post.content);
    if (raw_content !== null) {
      for (let i = 0; i < raw_content.length; i++) {
        if (raw_content[i].type === 'image') {
          const res = await api.get(`/upload/${raw_content[i].src}`);

          raw_content[i].src = res.data.content.image.fileName;
        }
      }
      content = raw_content;
    }

    title = post.title;

    introduce = post.introduce;
    price = post.price;
    is_paid = post.paid;
    background_image = '/api/uploads/' + post.backgroundImage.fileName;
    author = post.owner.name;
    created_at = new Date(post.createdAt);

    if (post.owner.id === $user?.id) {
      is_purchased = true;
      is_owner = true;
    }

    if ($user) {
      const { data: response2 } = await api.get('/post/paid');

      response2.content.posts.forEach((post) => {
        if (post.id === postId) {
          is_purchased = true;
        }
      });
    }

    fetched = false;
  });

  const purhcase = async () => {
    if (!$user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const tossPayments = await loadTossPayments('test_ck_Lex6BJGQOVDKEyjalPO3W4w2zNbg');

    const payment = tossPayments.payment({ customerKey: $user.id });

    const { orderId, paymentKey, amount } = await payment.requestPayment({
      method: 'CARD',
      orderId: Math.random().toString(36).substring(2, 11),
      orderName: title,
      amount: {
        currency: 'KRW',
        value: price,
      },
      windowTarget: 'iframe',
    });

    await api.post(`/post/${postId}/buy`, { orderId, paymentKey, amount: amount.value });

    goto('/').then(() => {
      goto('/post/' + postId);
    });
  };
</script>

{#if fetched}
  <div class="w-full h-full flex justify-center items-center">
    <p class="text-[18px]">로딩 중...</p>
  </div>
{:else}
  <div
    class=" relative w-full h-[167px] bg-[#D9D9D9] flex flex-col items-center bg-cover bg-center"
    style={background_image
      ? 'background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("' +
        background_image +
        '");'
      : ''}
  >
    <div class=" absolute w-[850px] top-1/2 -translate-y-1/2 flex flex-col">
      <input
        disabled
        bind:value={title}
        class="text-[35px] font-bold placeholder:text-white text-white bg-transparent ring-0 outline-none"
        placeholder="제목"
      />

      <p class=" text-[18px] text-white">
        {author} | {created_at.getFullYear()}. {String(created_at.getMonth() + 1).padStart(2, '0')}. {String(
          created_at.getDate(),
        ).padStart(2, '0')}
      </p>
    </div>
  </div>
  <div class="w-[740px] flex flex-col items-center mb-[100px]">
    <div
      class="w-[725px] h-[171px] py-[20px] px-[27px] rounded-[13px] border border-[#C9C9C9] mt-[31px] shadow-md"
    >
      <p class="text-black text-[18px] font-bold">포스트 소개</p>
      <textarea
        readonly
        bind:value={introduce}
        class="w-full h-[100px] text-[16px] resize-none outline-none ring-0 placeholder:text-[#C9C9C9]"
        placeholder="포스트 소개 작성"
      />
    </div>
    {#if (is_paid && is_purchased) || !is_paid}
      <div class="w-full h-full mt-[25px] text-inherit">
        {#each content as c, index}
          {#if c.type === 'markdown'}
            {@html marked(c.markdown)}
          {:else if c.type === 'image'}
            <img
              class="w-full rounded-[20px] my-[16px]"
              alt="image_{index}"
              src={'/api/uploads/' + c.src}
            />
          {:else if c.type === 'linebreak'}
            <br />
          {/if}
        {/each}
      </div>
    {:else}
      <div class="w-full h-full mt-[51px] flex flex-col items-center">
        <LockIcon />
        <p class="font-bold text-black text-[18px] mt-[20px]">
          결제 이후 열람이 가능한 컨텐츠입니다.
        </p>
      </div>
    {/if}
  </div>
  {#if is_paid && !is_purchased}
    <div class="fixed left-1/2 -translate-x-1/2 bottom-[32px] flex justify-between">
      <div
        class="w-[474px] h-[56px] rounded-[20px] bg-white border border-[#C9C9C9] shadow-lg flex items-center justify-between px-[20px]"
      >
        <input
          disabled
          value={Number(price).toLocaleString('ko-kr') + '원'}
          class="text-[18px] outline-none ring-0 placeholder:text-[#A0A0A0] w-2/3"
          placeholder="가격"
        />
        <button on:click={purhcase} class="p-[8px] bg-[#1A91FF] rounded-[11px] text-white">
          결제하기
        </button>
      </div>
    </div>
  {/if}
{/if}

<Comment id={postId} />

{#if !is_owner && $user}
  <Bookmark id={postId} />
{/if}

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
