<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import KakaoMap from '@/components/external/KakaoMap.vue';
import exchangeRateCalculation from '@/components/exchange/exchangeRateCalculation.vue';
import { useRouter } from 'vue-router';

const isOpen = ref(false);
const buttonRef = ref(null);
const tooltipRef = ref(null);
const router = useRouter();
const currentView = ref('buttons'); // 'buttons', 'map', 'converter'

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
  currentView.value = 'buttons';
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

const toggleKakaoMap = () => {
  currentView.value = 'map';
};

const toggleConverter = () => {
  currentView.value = 'converter';
};

const goBack = () => {
  currentView.value = 'buttons';
};

const goToNearestBankPage = () => {
  toggleTooltip();
  router.push('/find-nearest-bank');
};
</script>

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

    <!-- Tooltip Container -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
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
              class="z-10 p-1 text-gray-600 transition-colors duration-200 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <!-- Content Container -->
          <div class="relative flex flex-col items-center w-full gap-2 p-6">
            <!-- Views Container -->
            <div class="relative w-full h-full">
              <!-- Buttons View -->
              <Transition
                enter-active-class="transition-all duration-700 ease-in-out"
                enter-from-class="transform translate-x-full opacity-0"
                enter-to-class="transform translate-x-0 opacity-100"
                leave-active-class="transition-all duration-700 ease-in-out"
                leave-from-class="transform translate-x-0 opacity-100"
                leave-to-class="transform -translate-x-full opacity-0"
                mode="out-in"
              >
                <div
                  v-if="currentView === 'buttons'"
                  class="absolute inset-0 w-full space-y-2"
                >
                  <button
                    @click="toggleKakaoMap"
                    class="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                  >
                    근처 은행 찾기
                  </button>
                  <button
                    @click="toggleConverter"
                    class="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                  >
                    환율 계산
                  </button>
                </div>
              </Transition>

              <!-- Map View -->
              <Transition
                enter-active-class="transition-all duration-700 ease-in-out"
                enter-from-class="transform translate-x-full opacity-0"
                enter-to-class="transform translate-x-0 opacity-100"
                leave-active-class="transition-all duration-700 ease-in-out"
                leave-from-class="transform translate-x-0 opacity-100"
                leave-to-class="transform -translate-x-full opacity-0"
                mode="out-in"
              >
                <div
                  v-if="currentView === 'map'"
                  class="absolute inset-0 w-full"
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
                  <div class="relative w-full h-[300px]">
                    <KakaoMap class="w-full h-full" />
                  </div>
                  <div class="flex justify-end">
                    <button
                      @click="goBack"
                      class="px-4 py-2 mt-4 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
                    >
                      돌아가기
                    </button>
                  </div>
                </div>
              </Transition>

              <!-- Converter View -->
              <Transition
                enter-active-class="transition-all duration-700 ease-in-out"
                enter-from-class="transform translate-x-full opacity-0"
                enter-to-class="transform translate-x-0 opacity-100"
                leave-active-class="transition-all duration-700 ease-in-out"
                leave-from-class="transform translate-x-0 opacity-100"
                leave-to-class="transform -translate-x-full opacity-0"
                mode="out-in"
              >
                <div
                  v-if="currentView === 'converter'"
                  class="absolute inset-0 w-full h-full"
                >
                  <exchangeRateCalculation class="w-full h-full" />
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
      </div>
    </Transition>

    <!-- Backdrop -->
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
