<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import KakaoMap from '@/components/external/KakaoMap.vue';
import exchangeRateCalculation from '@/components/exchange/exchangeRateCalculation.vue';

const isOpen = ref(false);
const buttonRef = ref(null);
const tooltipRef = ref(null);

const tooltipStyle = computed(() => {
  if (!buttonRef.value) return {};

  const buttonRect = buttonRef.value.getBoundingClientRect();
  const tooltipBottom = buttonRect.top - 16;

  return {
    bottom: `${window.innerHeight - tooltipBottom}px`,
    right: '2rem',
  };
});

const toggleTooltip = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event) => {
  if (
    isOpen.value &&
    tooltipRef.value &&
    !tooltipRef.value.contains(event.target) &&
    !buttonRef.value.contains(event.target)
  ) {
    isOpen.value = false;
  }
};

const handleEscKey = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.removeEventListener('keydown', handleEscKey);
});

const showKakaoMap = ref(false);
const showConverter = ref(false);
const showButtons = ref(true);

const toggleKakaoMap = () => {
  showKakaoMap.value = true;
  showConverter.value = false;
  showButtons.value = false;
};

const toggleConverter = () => {
  showConverter.value = true;
  showKakaoMap.value = false;
  showButtons.value = false;
};

const goBack = () => {
  showKakaoMap.value = false;
  showConverter.value = false;
  showButtons.value = true;
};
</script>

<style>
@keyframes bounce-once {
  0%,
  100% {
    transform: rotate(45deg) translateY(0);
  }
  50% {
    transform: rotate(45deg) translateY(-5px);
  }
}

.animate-bounce-once {
  animation: bounce-once 1s ease-in-out;
}
</style>
<!-- SmartAssistantTooltip.vue -->
<template>
  <div class="relative">
    <!-- Smart Assistant Button -->
    <button
      ref="buttonRef"
      @click="toggleTooltip"
      class="fixed z-40 p-3 text-white transition-transform duration-200 bg-blue-600 rounded-full shadow-lg bottom-4 right-4 hover:bg-blue-700 hover:scale-110"
    >
      <span class="relative">
        AI 어시스턴트
        <span
          v-show="!isOpen"
          class="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1 animate-ping"
        ></span>
      </span>
    </button>

    <!-- Animated Tooltip Content -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="isOpen"
        ref="tooltipRef"
        class="fixed z-50 flex bg-white rounded-lg shadow-xl"
        :style="tooltipStyle"
      >
        <!-- Arrow -->
        <div
          class="absolute w-4 h-4 transform rotate-45 bg-white bottom-[-8px] right-8"
        ></div>

        <!-- Content -->
        <div
          class="relative z-10 flex w-[500px] h-[500px] p-4 bg-white rounded-lg overflow-hidden"
        >
          <div class="absolute flex justify-end top-2 right-2">
            <button
              @click="toggleTooltip"
              class="p-1 text-gray-600 transition-colors duration-200 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <!-- Animated Content Sections -->
          <div class="flex flex-col items-center w-full gap-2 pt-8">
            <!-- 버튼 그룹 -->
            <Transition
              enter-active-class="transition-all duration-500"
              leave-active-class="transition-all duration-500"
              enter-from-class="opacity-0"
              leave-to-class="opacity-0"
            >
              <div v-if="showButtons" class="w-full space-y-2">
                <button
                  @click="toggleKakaoMap"
                  class="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                >
                  카카오맵
                </button>
                <button
                  @click="toggleConverter"
                  class="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                >
                  환율 계산기
                </button>
              </div>
            </Transition>

            <!-- 카카오맵 -->
            <Transition
              enter-active-class="transition-all duration-500"
              leave-active-class="transition-all duration-500"
              enter-from-class="opacity-0 translate-x-[-20px]"
              leave-to-class="opacity-0 translate-x-[-20px]"
            >
              <div v-if="showKakaoMap" class="w-full">
                <KakaoMap class="w-full" />
                <button
                  @click="goBack"
                  class="px-4 py-2 mt-4 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
                >
                  돌아가기
                </button>
              </div>
            </Transition>

            <!-- 환율 계산기 -->
            <Transition
              enter-active-class="transition-all duration-500"
              leave-active-class="transition-all duration-500"
              enter-from-class="opacity-0 translate-x-[-20px]"
              leave-to-class="opacity-0 translate-x-[-20px]"
            >
              <div v-if="showConverter" class="w-full">
                <exchangeRateCalculation class="w-full" />
                <button
                  @click="goBack"
                  class="px-4 py-2 mt-4 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
                >
                  돌아가기
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Animated Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-30 bg-black bg-opacity-20 backdrop-blur-sm"
        @click="toggleTooltip"
      ></div>
    </Transition>
  </div>
</template>
