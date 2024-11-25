<script setup>
import { ref, onMounted } from 'vue';
import { aiService } from '@/services/aiService';
import { useFinanceNavigation } from '@/hooks/navigator/useFinanceNavigation';

const props = defineProps({
  service: {
    type: String,
    required: true,
  },
});

const { fetchRecommendProduct } = aiService;
const isLoading = ref(false);
const isError = ref(null);
const recommendation = ref(null);
const { navigateToFinProductDetail } = useFinanceNavigation();

// 타이핑 효과를 위한 변수들
const displayText = ref('');
const fullText = ref('');
const typingSpeed = 50;

const typeText = async (text) => {
  fullText.value = text;
  displayText.value = '';

  for (let i = 0; i < text.length; i++) {
    displayText.value += text[i];
    await new Promise((resolve) => setTimeout(resolve, typingSpeed));
  }
};

const handleRequestRecommendation = async () => {
  try {
    isLoading.value = true;
    const data = await fetchRecommendProduct(props.service);
    recommendation.value = data;
    // 타이핑 효과 시작
    typeText(data.financial_advice);
  } catch (error) {
    console.error('AI 추천 요청 실패:', error);
    isError.value = error;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  handleRequestRecommendation();
});

const emit = defineEmits(['close']);

const handleProductDetail = (service, productCode) => {
  // 부모 컴포넌트에 닫기 이벤트 발생
  emit('close');
  // 바로 페이지 이동
  navigateToFinProductDetail(service, productCode);
};
</script>

<template>
  <div class="space-y-4">
    <!-- 로딩 상태 표시 -->
    <!-- 400 에러 발생 시 재시도 버튼 -->
    <div
      v-if="isError"
      class="p-6 text-center border border-red-100 rounded-lg bg-red-50"
    >
      <p class="mb-4 text-red-600">데이터 요청에 실패했습니다.</p>
      <button
        @click="handleRequestRecommendation"
        class="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        재요청하기
      </button>
    </div>
    <div v-if="isLoading" class="p-6 text-center">
      <div class="flex items-center justify-center space-x-2">
        <div class="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
        <div
          class="w-4 h-4 delay-75 bg-blue-600 rounded-full animate-pulse"
        ></div>
        <div
          class="w-4 h-4 delay-150 bg-blue-600 rounded-full animate-pulse"
        ></div>
      </div>
      <p class="mt-4 text-gray-600">금융 상품 분석 중입니다...</p>
    </div>

    <!-- AI 응답 -->
    <div
      v-else-if="recommendation"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0 }"
      class="p-6 border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-white rounded-xl"
    >
      <!-- AI 금융 조언 -->
      <div class="p-4 mb-6 rounded-lg bg-gray-50">
        <div class="flex items-center mb-3 space-x-2">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 class="text-lg font-semibold text-gray-800">AI 금융 조언</h3>
        </div>
        <p
          class="leading-relaxed text-gray-600 break-words whitespace-pre-wrap overflow-wrap-anywhere"
        >
          {{ displayText }}
        </p>
      </div>

      <div v-if="recommendation.recommendations.length > 0">
        <div class="flex items-center mb-4 space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 class="text-xl font-bold text-gray-800">맞춤형 금융상품 추천</h3>
        </div>

        <ul class="space-y-4">
          <li
            v-for="(item, index) in recommendation.recommendations"
            :key="index"
            v-motion
            :initial="{ opacity: 0, x: -50 }"
            :enter="{ opacity: 1, x: 0, transition: { delay: index * 200 } }"
            class="p-4 transition-all bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg"
          >
            <div class="space-y-2">
              <h4 class="text-lg font-semibold text-gray-800">
                {{ item.fin_prdt_nm }}
              </h4>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="feature in item.key_features"
                  :key="feature"
                  class="px-2 py-1 text-sm text-blue-600 bg-blue-100 rounded-full"
                >
                  {{ feature }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="text-gray-600">기본 금리</div>
                <div class="font-medium">{{ item.interest_rate }}</div>
                <div class="text-gray-600">최대 금리</div>
                <div class="font-medium text-blue-600">
                  {{ item.max_interest_rate }}
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-600">{{ item.reason }}</p>
              <button
                @click="handleProductDetail(props.service, item.fin_prdt_cd)"
                class="w-full px-4 py-2 mt-3 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                상품 상세정보 확인하기
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 스크롤바 스타일링 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #bfdbfe;
  border-radius: 3px;
}

.overflow-wrap-anywhere {
  overflow-wrap: anywhere;
  word-break: break-word;
  -ms-word-break: break-all;
  word-wrap: break-word;
}
</style>
