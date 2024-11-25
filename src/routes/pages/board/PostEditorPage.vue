<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { boardService } from '@/services/boardService';
import TabHeader from '@/components/common/TabHeader.vue';
import PostTitle from '@/components/board/PostTitle.vue';
import ProductSelection from '@/components/board/ProductSelection.vue';
import PostContent from '@/components/board/PostContent.vue';
import ActionButtons from '@/components/board/ActionButtons.vue';
import Loading from '@/components/common/Loading.vue';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'vue-sonner';
import BackBtn from '@/components/common/BackBtn.vue';

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
const userStore = useUserStore();
const isPageLoading = ref(true);
const isLoading = ref(false);

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
      isPageLoading.value = true;
      const response = await read(route.params.id);

      if (response.board.user !== userStore.userData.username) {
        toast.error('자신의 게시물만 수정할 수 있습니다.', {
          style: {
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #dc2626',
            width: '400px',
            right: '0',
          },
        });
        router.push('/board');
        return;
      }

      formData.value = {
        title: response.board.title,
        product_code: response.board.product_code,
        type: response.board.type,
        content: response.board.content,
        product: response.board.product,
      };
    } catch (error) {
      toast.error('게시글을 불러오는데 실패했습니다.', {
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #dc2626',
          width: '400px',
          right: '0',
        },
      });
      router.push('/board');
    } finally {
      isPageLoading.value = false;
    }
  } else {
    isPageLoading.value = false;
  }
};

// 컴포넌트 마운트 시 게시글 데이터 불러오기
onMounted(async () => {
  await fetchPost();
});

const handleSubmit = async () => {
  if (!formData.value.title || !formData.value.content) {
    toast.error('제목과 내용을 모두 입력해주세요.', {
      style: {
        background: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #dc2626',
      },
    });
    return;
  }

  try {
    if (!formData.value.product_code) {
      toast.error('상품을 선택해주세요.', {
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #dc2626',
        },
      });
      return;
    }

    if (props.mode === 'create') {
      await create(formData.value);
      toast.success('게시글이 등록되었습니다!', {
        style: {
          background: '#dcfce7',
          color: '#16a34a',
          border: '1px solid #16a34a',
        },
      });
    } else {
      await update(route.params.id, formData.value);
      toast.success('게시글이 수정되었습니다!', {
        style: {
          background: '#dcfce7',
          color: '#16a34a',
          border: '1px solid #16a34a',
        },
      });
    }
    router.push('/board');
  } catch (error) {
    toast.error('게시글 처리 중 오류가 발생했습니다.', {
      style: {
        background: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #dc2626',
      },
    });
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
      <Loading message="게시글 불러오는 중..." v-if="isPageLoading" />
      <div v-else>
        <div class="flex justify-end w-full">
          <BackBtn />
        </div>
        <PostTitle v-model="formData.title" :disabled="isLoading" />

        <ProductSelection
          v-model:type="formData.type"
          v-model:product-code="formData.product_code"
          :mode="mode"
          :edit-product="formData.product"
        />

        <PostContent v-model="formData.content" :disabled="isLoading" />

        <ActionButtons
          :submit-text="submitButtonText"
          @submit="handleSubmit"
          @cancel="goBack"
        />
      </div>
    </main>
  </div>
</template>
