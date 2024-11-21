<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { boardService } from '@/services/boardService';
import TabHeader from '@/components/common/TabHeader.vue';
import PostTitle from '@/components/board/PostTitle.vue';
import ProductSelection from '@/components/board/ProductSelection.vue';
import PostContent from '@/components/board/PostContent.vue';
import ActionButtons from '@/components/board/ActionButtons.vue';

const props = defineProps({
  mode: {
    type: String,
    validator: (value) => ['create', 'edit'].includes(value),
    required: true,
  },
});

const router = useRouter();
const route = useRoute();
const { create, update, read } = boardService();

const formData = ref({
  title: '',
  product_code: '',
  type: 'DEPOSIT', // 기본값으로 적금상품 선택
  content: '',
});

const pageTitle = computed(() => {
  return props.mode === 'create' ? '새 글 작성' : '게시물 수정';
});

const submitButtonText = computed(() => {
  return props.mode === 'create' ? '등록' : '수정 완료';
});

const fetchPost = async () => {
  if (props.mode === 'edit') {
    try {
      const post = await read(route.params.id);
      formData.value = {
        title: post.title,
        product_code: post.product_code,
        type: post.type,
        content: post.content,
      };
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
      router.push('/board');
    }
  }
};

// 컴포넌트 마운트 시 게시글 데이터 불러오기
onMounted(() => {
  fetchPost();
});

const handleSubmit = async () => {
  if (!formData.value.title || !formData.value.content) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  try {
    // type이 빈 문자열이거나 'DEPOSIT' 또는 'SAVINGS' 중 하나인지 확인
    if (!formData.value.product_code) {
      alert('상품을 선택해주세요.');
      return;
    }

    if (props.mode === 'create') {
      await create(formData.value);
    } else {
      await update(route.params.id, formData.value);
    }
    router.push('/board');
  } catch (error) {
    console.error('게시글 처리 실패:', error);
  }
};

const goBack = () => {
  router.push(props.mode === 'create' ? '/board' : `/board/${route.params.id}`);
};
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <TabHeader :title="pageTitle" />

    <main
      class="flex flex-col w-full max-w-2xl px-6 py-8 mt-10 bg-white rounded-lg shadow-lg"
    >
      <PostTitle v-model="formData.title" />

      <ProductSelection
        v-model:type="formData.type"
        v-model:product-code="formData.product_code"
      />

      <PostContent v-model="formData.content" />

      <ActionButtons
        :submit-text="submitButtonText"
        @submit="handleSubmit"
        @cancel="goBack"
      />
    </main>
  </div>
</template>
