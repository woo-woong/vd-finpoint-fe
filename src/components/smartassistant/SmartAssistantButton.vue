<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import KakaoMap from '@/components/external/KakaoMap.vue';
import exchangeRateCalculation from '@/components/exchange/exchangeRateCalculation.vue';
import FinProductAdvisorBubble from '@/components/smartAssistant/FinProductAdvisorBubble.vue';
import { useRouter } from 'vue-router';

const isOpen = ref(false);
const buttonRef = ref(null);
const tooltipRef = ref(null);
const router = useRouter();
const currentView = ref('buttons'); // 'buttons', 'map', 'converter'
const selectedService = ref(null); // 'deposit' 또는 'savings'를 저장

const tooltipStyle = computed(() => {
  if (!buttonRef.value) return {};

  const buttonRect = buttonRef.value.getBoundingClientRect();
  const tooltipBottom = buttonRect.top - 16;

  return {
    bottom: `${window.innerHeight - tooltipBottom}px`,
    right: '2rem',
    height: '600px', // 고정 높이 추가
  };
});

const toggleTooltip = () => {
  isOpen.value = !isOpen.value;
  currentView.value = 'buttons';
};

const handleClickOutside = (event) => {
  const isMenuButton = event.target.closest('button');
  const isInsideTooltip = tooltipRef.value?.contains(event.target);
  const isMainButton = buttonRef.value?.contains(event.target);

  if (isOpen.value && !isInsideTooltip && !isMainButton && !isMenuButton) {
    isOpen.value = false;
  }
};

const handleEscKey = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscKey);
});

const toggleKakaoMap = () => {
  currentView.value = 'map';
};

const toggleConverter = () => {
  currentView.value = 'converter';
};

const toggleFinProductAdvisor = (service) => {
  selectedService.value = service;
  currentView.value = 'fin-product-advisor';
};

const goBack = () => {
  currentView.value = 'buttons';
  selectedService.value = null;
};

const goToNearestBankPage = () => {
  toggleTooltip();
  router.push('/find-nearest-bank');
};

const goToExchangeRateCalculatorPage = () => {
  toggleTooltip();
  router.push('/calculate-exchange-rate');
};

const assistantName = ref('낚시왕 핀피');
const welcomeMessage = ref(
  '🎣 안녕하세요! \n 오늘도 좋은 금융상품을 낚으러 오셨네요! \n 무엇을 도와드릴까요?'
);
</script>

<template>
  <div class="relative">
    <!-- Smart Assistant Button -->
    <button
      ref="buttonRef"
      @click="toggleTooltip"
      class="fixed z-40 p-3 text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-lg bottom-4 right-4 hover:scale-105 hover:shadow-xl group"
    >
      <div class="relative flex items-center gap-2 px-2">
        <div class="relative">
          <span class="text-2xl">🎣</span>
          <span
            v-show="!isOpen"
            class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"
          ></span>
        </div>
        <span class="font-medium">{{ assistantName }}</span>
      </div>
    </button>

    <!-- Tooltip Container -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-show="isOpen"
        ref="tooltipRef"
        :style="tooltipStyle"
        class="fixed z-50 w-[400px] rounded-2xl shadow-2xl overflow-hidden border border-blue-400 flex flex-col"
      >
        <!-- 헤더 -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-400 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-full">
                <span class="text-2xl">🎣</span>
              </div>
              <div>
                <h3 class="font-bold text-white">{{ assistantName }}</h3>
                <p class="text-xs text-blue-100">AI 금융 어시스턴트</p>
              </div>
            </div>
            <button
              @click="toggleTooltip"
              class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="bg-gradient-to-b from-blue-50/50 to-white flex-1 relative">
          <!-- 웰컴 메시지 -->
          <div v-if="currentView === 'buttons'" class="p-4">
            <div
              class="bg-white rounded-2xl p-3 shadow-sm border border-blue-400"
            >
              <p
                class="text-gray-700 break-words whitespace-pre-wrap overflow-wrap-anywhere"
              >
                {{ welcomeMessage }}
              </p>
            </div>
          </div>

          <!-- 서비스 메뉴 -->
          <div v-if="currentView === 'buttons'" class="px-4 pb-4 space-y-2">
            <button
              v-for="(service, index) in [
                {
                  icon: '🐟',
                  text: '예금 상품 낚시터',
                  subtext: '목돈 굴리기',
                  action: () => toggleFinProductAdvisor('deposit'),
                },
                {
                  icon: '🐠',
                  text: '적금 상품 낚시터',
                  subtext: '돈 모으기',
                  action: () => toggleFinProductAdvisor('savings'),
                },
                {
                  icon: '🗺️',
                  text: '주변 은행 찾기',
                  subtext: '가까운 낚시터 탐색',
                  action: toggleKakaoMap,
                },
                {
                  icon: '💰',
                  text: '환율 계산기',
                  subtext: '환율 계산을 도와드립니다',
                  action: toggleConverter,
                },
              ]"
              :key="index"
              @click="service.action"
              class="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-blue-50/50 transition-colors border border-blue-200 hover:border-blue-300 group"
            >
              <div
                class="p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors"
              >
                <span class="text-xl">{{ service.icon }}</span>
              </div>
              <div class="text-left">
                <div class="font-medium text-gray-800">{{ service.text }}</div>
                <div class="text-sm text-gray-500">{{ service.subtext }}</div>
              </div>
            </button>
          </div>

          <!-- 다른 뷰들은 기존 코드 유지 -->
          <!-- Map View -->
          <div
            v-if="currentView === 'map'"
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1 }"
            :leave="{ opacity: 0 }"
            class="absolute inset-0 w-full h-full flex flex-col p-4"
          >
            <div class="flex justify-between mb-3">
              <h2 class="mb-2 text-xl font-bold">근처 은행 찾기</h2>
              <button
                @click="goToNearestBankPage"
                class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
              >
                크게 보기
              </button>
            </div>
            <div class="relative flex-1">
              <KakaoMap class="w-full h-full" />
            </div>
            <div class="flex justify-end mt-4">
              <button
                @click="goBack"
                class="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
              >
                돌아가기
              </button>
            </div>
          </div>

          <!-- Converter View -->
          <div
            v-if="currentView === 'converter'"
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1 }"
            :leave="{ opacity: 0 }"
            class="absolute inset-0 w-full h-full flex flex-col p-4"
          >
            <div class="flex justify-between mb-3">
              <h2 class="mb-2 text-xl font-bold">환율 계산기</h2>
              <button
                @click="goToExchangeRateCalculatorPage"
                class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
              >
                크게 보기
              </button>
            </div>
            <div class="flex-1 overflow-auto">
              <exchangeRateCalculation />
            </div>
            <div class="mt-4">
              <button
                @click="goBack"
                class="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
              >
                돌아가기
              </button>
            </div>
          </div>

          <!-- FinProductAdvisor View -->
          <div
            v-if="currentView === 'fin-product-advisor'"
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1 }"
            :leave="{ opacity: 0 }"
            class="absolute inset-0 w-full h-full"
          >
            <div class="relative flex flex-col h-full bg-white rounded-lg p-4">
              <!-- 헤더 -->
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-semibold">AI 금융 상품 추천</h2>
              </div>

              <!-- 컨텐츠 영역 - 단일 스크롤 -->
              <div class="flex-1 overflow-y-auto pr-2">
                <FinProductAdvisorBubble
                  :service="selectedService"
                  @close="isOpen = false"
                />
              </div>

              <!-- 푸터 -->
              <div class="mt-4">
                <button
                  @click="goBack"
                  class="w-full px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-gray-50"
                >
                  돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 물결 효과가 있는 푸터 -->
        <div
          class="h-2 bg-gradient-to-r from-blue-600 to-blue-400 relative overflow-hidden"
        >
          <div class="absolute inset-0 waves-animation"></div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #bfdbfe transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #bfdbfe;
  border-radius: 2px;
}

.waves-animation {
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: waves 2s infinite linear;
  transform: translateX(-100%);
}

@keyframes waves {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.message-bubble {
  @apply bg-white/90 p-4 rounded-lg shadow-sm mb-4 max-w-[80%] border border-blue-100;
}

.assistant-message {
  @apply ml-0;
}

.user-message {
  @apply ml-auto bg-blue-50;
}

.overflow-wrap-anywhere {
  overflow-wrap: anywhere;
}
</style>
