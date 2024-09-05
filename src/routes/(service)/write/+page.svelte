<script>
  import { goto } from '$app/navigation';
  import { api } from '$lib/api.js';
  import ImageIcon from '$lib/icons/ImageIcon.svelte';
  import { marked } from 'marked';

  let background_image = '';
  let background_image_file;
  let prompt = '';
  let title = '';
  let introduce = '';
  let contents = [];
  let price = '0';

  marked.use({
    breaks: true,
    gfm: true,
  });

  const selectBackground = async (e) => {
    background_image_file = e.target.files[0];

    let reader = new FileReader();

    reader.readAsDataURL(background_image_file);
    reader.onload = (e) => {
      background_image = e.target.result;
    };
  };

  const addImage = async (e) => {
    let file = e.target.files[0];

    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      contents.push({
        type: 'image',
        src: e.target.result,
        file,
      });
      contents = contents;
    };
  };

  async function upload() {
    if (!background_image_file || contents.length === 0 || !introduce) {
      alert('글의 필수 요소들을 다 작성하여 주세요. ');
      return;
    }

    let background_image_filename;

    {
      const formData = new FormData();
      formData.append('file', background_image_file);

      const { data: response } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      background_image_filename = response.content.image.id;
    }

    for (const content of contents) {
      if (content.type === 'image' && content.file) {
        const formData = new FormData();
        formData.append('file', content.file);

        const { data: response } = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        content.src = response.content.image.id;
        delete content.file;
      }
    }

    await api.put('/post', {
      title,
      content: JSON.stringify(contents),
      introduce,
      imageId: background_image_filename,
      isPaid: Number(price?.replace(/\D/g, '')) > 0,
      price: Number(price?.replace(/\D/g, '')),
    });

    await goto('/my/posted');
  }

  $: {
    if (price) {
      price = Number(price.replace(/\D/g, '')).toLocaleString('ko-kr');
    }
  }
</script>

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
      bind:value={title}
      class="text-[35px] font-bold placeholder:text-white text-white bg-transparent ring-0 outline-none"
      placeholder="제목"
    />
    <label for="select_background" class="font-medium text-[20px] text-white">사진 추가하기</label>
    <input
      class="h-0 w-0"
      type="file"
      id="select_background"
      name="select_background"
      accept="image/*"
      on:change={selectBackground}
    />
  </div>
</div>
<div class="w-[740px] flex flex-col items-center mb-[100px]">
  <div
    class="w-[725px] h-[171px] py-[20px] px-[27px] rounded-[13px] border border-[#C9C9C9] mt-[31px] shadow-md"
  >
    <p class="text-black text-[18px] font-bold">포스트 소개</p>
    <textarea
      bind:value={introduce}
      class="w-full h-[100px] text-[16px] resize-none outline-none ring-0 placeholder:text-[#C9C9C9]"
      placeholder="포스트 소개 작성"
    />
  </div>
  <div class="w-full h-full mt-[25px] text-inherit">
    {#each contents as c, index}
      {#if c.type === 'markdown'}
        {@html marked(c.markdown)}
      {:else if c.type === 'image'}
        <img class="w-full rounded-[20px] my-[16px]" alt="image_{index}" src={c.src} />
      {:else if c.type === 'linebreak'}
        <br />
      {/if}
    {/each}
  </div>
  <textarea
    bind:value={prompt}
    on:keydown={(e) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        if (prompt === '') {
          contents.push({
            type: 'linebreak'
          });
          prompt = '';
          contents = contents;
          return;
        }
        contents.push({
          type: 'markdown',
          markdown: prompt
        });
        contents = contents;
        prompt = '';
      }
    }}
    class=" w-full h-full text-[16px] placeholder:text-[#C9C9C9]
    resize-none outline-none ring-0"
    placeholder="작성하세요"
    on:input={(e) => {
      const textarea = e.srcElement;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }}
  />
</div>
<input
  class="h-0 w-0"
  type="file"
  id="add_image"
  name="add_image"
  accept="image/*"
  on:change={addImage}
/>

<div class="fixed left-1/2 -translate-x-1/2 bottom-[32px] w-[541px] flex justify-between">
  <label
    for="add_image"
    class="group w-[56px] h-[56px] aspect-square flex items-center justify-center bg-white border border-[#C9C9C9] shadow-lg rounded-full"
  >
    <ImageIcon />
  </label>
  <div
    class="w-[474px] h-[56px] rounded-[20px] bg-white border border-[#C9C9C9] shadow-lg flex items-center justify-between px-[20px]"
  >
    <input
      bind:value={price}
      class="text-[18px] outline-none ring-0 placeholder:text-[#A0A0A0] w-2/3"
      placeholder="가격"
    />
    <button on:click={upload} class="p-[8px] bg-[#1A91FF] rounded-[11px] text-white"
      >{Number(price?.replace(/\D/g, '')) > 0 ? '유료로' : '무료로'} 공유하기
    </button>
  </div>
</div>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
