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
  // replace: true 옵션을 사용하여 히스토리에 추가하지 않고 페이지 이동
  navigateToFinProductDetail(service, productCode, { replace: true });
};
</script>

<template>
  <div class="space-y-4">
    <!-- 로딩 상태 표시 -->
    <div v-if="isLoading" class="text-center p-6">
      <div class="flex items-center justify-center space-x-2">
        <div class="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
        <div
          class="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-75"
        ></div>
        <div
          class="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-150"
        ></div>
      </div>
      <p class="text-gray-600 mt-4">금융 상품 분석 중입니다...</p>
    </div>

    <!-- AI 응답 -->
    <div
      v-else-if="recommendation"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0 }"
      class="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border border-blue-100"
    >
      <!-- AI 금융 조언 -->
      <div class="p-4 bg-gray-50 rounded-lg mb-6">
        <div class="flex items-center space-x-2 mb-3">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 class="text-lg font-semibold text-gray-800">AI 금융 조언</h3>
        </div>
        <p class="text-gray-600 leading-relaxed break-all">
          {{ displayText }}
        </p>
      </div>

      <div v-if="recommendation.recommendations.length > 0">
        <div class="flex items-center space-x-2 mb-4">
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
            class="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-md transition-all"
          >
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="feature in item.key_features"
                  :key="feature"
                  class="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                >
                  {{ feature }}
                </span>
              </div>
              <h4 class="text-lg font-semibold text-gray-800">
                {{ item.fin_prdt_nm }}
              </h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="text-gray-600">기본 금리</div>
                <div class="font-medium">{{ item.interest_rate }}</div>
                <div class="text-gray-600">최대 금리</div>
                <div class="font-medium text-blue-600">
                  {{ item.max_interest_rate }}
                </div>
              </div>
              <p class="text-gray-600 text-sm mt-2">{{ item.reason }}</p>
              <button
                @click="handleProductDetail(props.service, item.fin_prdt_cd)"
                class="w-full px-4 py-2 mt-3 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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
</style>
