<script setup>
import { ref, watch } from 'vue';
import { finProductService } from '@/services/finProductService';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import { useFinanceNavigation } from '@/hooks/navigator/useFinanceNavigation';

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

const handleUnsubscribe = async (event, product) => {
  event.stopPropagation();

  try {
    const productData = {
      fin_prdt_cd: product.fin_prdt_cd,
      type: product.type,
    };
    await unsubscribeFinProduct(productData, product.id);
    localSubscribedProducts.value = localSubscribedProducts.value.filter(
      (p) => p.id !== product.id
    );
  } catch (error) {
    console.error('상품 가입 해제 실패:', error);
    alert('상품 가입 해제에 실패했습니다. 다시 시도해주세요.');
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
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold text-gray-800">나의 가입 상품</h2>
        <p class="text-gray-600">
          총
          <span class="font-semibold text-blue-600">{{
            localSubscribedProducts.length
          }}</span
          >개의 상품에 가입되어 있습니다
        </p>
      </div>
      <button
        type="button"
        class="px-6 py-2 text-sm font-semibold text-white transition-colors bg-green-500 rounded-lg shadow hover:bg-green-600"
        @click="isManagingAll = !isManagingAll"
      >
        {{ isManagingAll ? '종료' : '상품 가입 관리' }}
      </button>
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
            spaceBetween: 10,
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
            class="relative h-full p-4 transition duration-200 rounded-lg shadow bg-gray-100 hover:shadow-lg"
          >
            <!-- 상품 정보 -->
            <div class="flex flex-col h-full space-y-3 p-1">
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
                  class="px-3 py-2 space-y-1 text-sm text-gray-600 bg-gray-200 rounded"
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

              <!-- 자세히 보기 오버레이 -->
              <div
                v-if="!isManagingAll"
                class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100"
              >
                <span
                  @click="
                    !isManagingAll &&
                      navigateToFinProductDetail(
                        product.type,
                        product.fin_prdt_cd
                      )
                  "
                  class="text-lg font-semibold text-white cursor-pointer"
                  >자세히 보기 →</span
                >
              </div>
            </div>

            <!-- 관리 버튼 -->
            <button
              v-if="isManagingAll"
              type="button"
              class="absolute p-2 text-white transition-all duration-300 ease-in-out bg-red-500 rounded-full shadow-md bottom-2 right-2 hover:bg-red-600"
              @click="(event) => handleUnsubscribe(event, product)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5.75 12h12.5"
                />
              </svg>
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
      <!-- 커스텀 네비게이션 버튼 -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>

<style scoped>
.financial-swiper {
  padding: 1rem !important;
  height: 300px;
}

.financial-swiper-container {
  position: relative;
  padding: 0 50px; /* 좌우 네비게이션 버튼을 위한 여백 */
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #3b82f6;
  background-color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0;
  z-index: 20;
}

/* 네비게이션 버튼 위치 조정 */
:deep(.swiper-button-prev) {
  left: 0;
}

:deep(.swiper-button-next) {
  right: 0;
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
