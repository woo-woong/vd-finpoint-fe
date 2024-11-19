<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FinProductsService from '@/services/finProductsService';
import BoardService from '@/services/boardService';

const props = defineProps({
  mode: {
    type: String,
    validator: (value) => ['create', 'edit'].includes(value),
    required: true,
  },
});

const router = useRouter();
const route = useRoute();

const pageTitle = computed(() => {
  return props.mode === 'create' ? '새 글 작성' : '게시물 수정';
});

const submitButtonText = computed(() => {
  return props.mode === 'create' ? '등록' : '수정 완료';
});

const selectedType = ref('deposit');

const formData = ref({
  title: '',
  product_code: '',
  type: selectedType.value.toUpperCase(), // 백엔드 요구 사항: type 대문자로
  content: '',
});

const products = ref([]);

const productTypes = [
  { value: 'deposit', label: '예금' },
  { value: 'savings', label: '적금' },
];

const fetchProducts = async () => {
  try {
    const response = await FinProductsService(selectedType.value, {
      topFinGrpNo: '020000',
      pageNo: '1',
    });
    products.value = response.map((product) => ({
      code: product.fin_prdt_cd,
      name: product.fin_prdt_nm,
    }));
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    alert('상품 목록을 불러오는데 실패했습니다.');
  }
};
const fetchPost = async (postId) => {
  try {
    const post = await BoardService().read(postId); // 게시글 조회 API 호출
    formData.value.title = post.board.title;
    formData.value.product_code = post.product.fin_prdt_cd;
    formData.value.content = post.board.content;
  } catch (error) {
    console.error('게시글 불러오기 실패:', error);
    alert('게시글을 불러오는데 실패했습니다.');
  }
};

watch(selectedType, () => {
  fetchProducts();
});

onMounted(() => {
  fetchProducts();
  if (props.mode === 'edit') {
    fetchPost(route.params.id); // edit 모드일 때 게시글 데이터 가져오기
  }
});

const { create, update } = BoardService();

const handleSubmit = async () => {
  if (!formData.value.title || !formData.value.content) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  if (props.mode === 'create') {
    try {
      await create(formData.value);
      router.push('/board');
    } catch (error) {
      console.error('게시글 생성 실패:', error);
    }
  } else if (props.mode === 'edit') {
    try {
      await update(route.params.id, formData.value);
      router.push('/board');
    } catch (error) {
      console.log('글 수정:', formData.value);
    }
  }

  router.push('/board');
};

const goBack = () => {
  router.push(props.mode === 'create' ? '/board' : `/board/${route.params.id}`);
};
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
    </header>

    <main
      class="flex flex-col w-full max-w-2xl px-6 py-8 mt-10 bg-white rounded-lg shadow-lg"
    >
      <!-- 폼 내용은 기존 PostWrite/PostEdit과 동일 -->
      <div class="mb-6">
        <label
          for="title"
          class="block mb-2 text-sm font-semibold text-gray-700"
        >
          제목
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div class="mb-6">
        <label
          for="type"
          class="block mb-2 text-sm font-semibold text-gray-700"
        >
          상품 유형
        </label>
        <select
          id="type"
          v-model="selectedType"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">상품 유형을 선택하세요</option>
          <option
            v-for="type in productTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </select>
      </div>

      <div class="mb-8">
        <label
          for="product_code"
          class="block mb-2 text-sm font-semibold text-gray-700"
        >
          추천할 상품
        </label>
        <select
          id="product_code"
          v-model="formData.product_code"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">상품을 선택하세요</option>
          <option
            v-for="product in products"
            :key="product.code"
            :value="product.code"
          >
            {{ product.name }}
          </option>
        </select>
      </div>

      <div class="mb-8">
        <label
          for="content"
          class="block mb-2 text-sm font-semibold text-gray-700"
        >
          내용
        </label>
        <textarea
          id="content"
          v-model="formData.content"
          rows="8"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="handleSubmit"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
        >
          {{ submitButtonText }}
        </button>
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
        >
          취소
        </button>
      </div>
    </main>
  </div>
</template>
