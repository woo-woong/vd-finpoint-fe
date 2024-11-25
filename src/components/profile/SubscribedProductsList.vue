<script setup>
import { ref, watch } from 'vue';
import { finProductService } from '@/services/finProductService';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import { useFinanceNavigation } from '@/hooks/navigator/useFinanceNavigation';
import { Progress } from '@/components/ui/progress';
import { toast } from 'vue-sonner';
import WarningCard from '@/components/common/WarningCard.vue';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const { unsubscribeFinProduct } = finProductService();

const { navigateToFinProductDetail } = useFinanceNavigation();

const props = defineProps({
  subscribedProducts: {
    type: Array,
    default: () => [],
  },
});

const isManagingAll = ref(false);
const localSubscribedProducts = ref([...props.subscribedProducts]);

watch(
  () => props.subscribedProducts,
  (newProducts) => {
    localSubscribedProducts.value = [...newProducts];
  }
);

const isLoading = ref(false);
const progress = ref(0);
const currentMessage = ref('');

const unsubscribeLoadingMessages = [
  '가입 취소를 처리하고 있습니다...',
  '고객님의 요청을 처리중입니다 📝',
  '안전하게 취소 처리를 진행하고 있어요 ⚡️',
  '조금만 더 기다려주세요! 🔄',
];

const simulateProgress = () => {
  progress.value = 100;
  let currentMessageIndex = 0;
  currentMessage.value = unsubscribeLoadingMessages[0];

  const messageInterval = setInterval(() => {
    currentMessageIndex =
      (currentMessageIndex + 1) % unsubscribeLoadingMessages.length;
    currentMessage.value = unsubscribeLoadingMessages[currentMessageIndex];
  }, 875);

  const totalSteps = 100;
  const stepTime = 3500 / totalSteps;

  const interval = setInterval(() => {
    if (progress.value <= 0) {
      clearInterval(interval);
      clearInterval(messageInterval);
      return;
    }
    progress.value -= 1;
  }, stepTime);

  return { progressInterval: interval, messageInterval };
};

const handleUnsubscribe = async (event, product) => {
  event.stopPropagation();
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    const { progressInterval, messageInterval } = simulateProgress();

    const productData = {
      fin_prdt_cd: product.fin_prdt_cd,
      type: product.type,
    };

    await unsubscribeFinProduct(productData, product.id);
    await new Promise((resolve) => setTimeout(resolve, 4000));

    clearInterval(progressInterval);
    clearInterval(messageInterval);
    progress.value = 0;

    localSubscribedProducts.value = localSubscribedProducts.value.filter(
      (p) => p.id !== product.id
    );

    toast.success('상품 가입이 취소되었습니다.', {
      style: {
        background: '#dcfce7',
        color: '#16a34a',
        border: '1px solid #16a34a',
      },
    });
  } catch (error) {
    progress.value = 0;
    toast.error('상품 가입 해제에 실패했습니다. 다시 시도해주세요.', {
      style: {
        background: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #dc2626',
      },
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0 }"
    :transition="{ duration: 100 }"
    class="space-y-6"
  >
    <!-- 상품 개수 표시 -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">나의 가입 상품</h2>
        <button
          type="button"
          class="px-6 py-2 text-sm font-semibold text-white transition-colors bg-green-500 rounded-lg shadow hover:bg-green-600"
          @click="isManagingAll = !isManagingAll"
        >
          {{ isManagingAll ? '종료' : '상품 가입 관리' }}
        </button>
      </div>
      <div class="flex justify-between gap-2 relative">
        <p class="text-gray-600">
          총
          <span class="font-semibold text-blue-600">{{
            localSubscribedProducts.length
          }}</span
          >개의 상품에 가입되어 있습니다
        </p>
        <WarningCard
          v-if="isManagingAll"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
          :transition="{ duration: 100 }"
          message="⚠️ 가입 취소는 진행 중 취소가 불가능합니다. 신중히 결정해 주시기 바랍니다."
        />
      </div>
    </div>

    <!-- Swiper 컨테이너 -->
    <div class="relative financial-swiper-container">
      <Swiper
        :modules="[Navigation, Pagination]"
        :slides-per-view="1"
        :space-between="30"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }"
        :pagination="{ clickable: true }"
        :breakpoints="{
          '640': {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          '1024': {
            slidesPerView: 3,
            spaceBetween: 18,
          },
        }"
        class="w-full financial-swiper"
      >
        <SwiperSlide
          v-for="(product, index) in localSubscribedProducts"
          :key="product.id"
          class="pb-12"
        >
          <div
            class="relative h-[200px] rounded-lg shadow bg-gray-100 hover:shadow-lg"
          >
            <!-- 상품 정보 -->
            <div class="h-full p-4">
              <!-- 상품명 -->
              <div class="flex items-start">
                <span
                  class="w-20 px-2 py-1 text-xs font-medium text-center text-white rounded-full shrink-0"
                  :class="
                    product.type === 'DEPOSIT' ? 'bg-blue-600' : 'bg-blue-900'
                  "
                >
                  {{ product.type === 'DEPOSIT' ? '예금상품' : '적금상품' }}
                </span>
                <h3
                  class="ml-2 text-lg font-bold text-gray-600 truncate break-keep"
                >
                  {{ product.fin_prdt_nm }}
                </h3>
              </div>

              <!-- 은행명 -->
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span class="ml-2 font-semibold text-gray-500 text-md">
                  {{ product.kor_co_nm }}
                </span>
              </div>

              <!-- 상품 상세 정보 -->
              <div class="flex-1">
                <div
                  class="px-4 py-3 space-y-2 text-sm text-gray-600 bg-gray-200 rounded"
                >
                  <p>
                    <span class="font-medium">가입방법:</span>
                    <span class="break-keep">
                      {{ product.product_detail?.join_way }}
                    </span>
                  </p>
                  <p>
                    <span class="font-medium">가입대상:</span>
                    <span class="break-keep">
                      {{ product.product_detail?.join_member }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- 자세히 보기 오버레이 -->
            <div
              v-if="!isManagingAll"
              class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100"
            >
              <span
                class="text-lg font-semibold text-white cursor-pointer"
                @click="
                  navigateToFinProductDetail(product.type, product.fin_prdt_cd)
                "
              >
                자세히 보기 →
              </span>
            </div>

            <!-- 삭제 버튼 -->
            <button
              v-if="isManagingAll"
              class="absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              @click="(event) => handleUnsubscribe(event, product)"
            >
              -
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
      <!-- 커스텀 네비게이션 버튼 -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

    <!-- 로딩 오버레이 추가 -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -20 }"
        class="p-8 bg-white rounded-lg shadow-xl w-[500px]"
      >
        <div class="space-y-6">
          <Progress :modelValue="progress" />
          <p
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -20 }"
            :key="currentMessage"
            class="text-center text-gray-700 font-medium"
          >
            {{ currentMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.financial-swiper {
  padding: 1rem !important;
  height: 280px;
}

.financial-swiper-container {
  position: relative;
  padding: 0 50px;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #3b82f6;
  background-color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  top: calc(50% - 30px);
  transform: translateY(-50%);
  margin-top: 0;
  z-index: 20;
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 1.2rem;
  font-weight: bold;
}

:deep(.swiper-button-disabled) {
  opacity: 0.5;
  pointer-events: none; /* 버튼 비활성화 시 클릭 이벤트 방지 */
}

:deep(.swiper-pagination-bullet) {
  background: #3b82f6;
}

:deep(.swiper-pagination-bullet-active) {
  background: #2563eb;
}
</style>
