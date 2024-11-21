<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToProductDetail = (service, fin_prdt_cd) => {
  if (service && fin_prdt_cd) {
    router.push({
      path: `/${service.toLowerCase()}/detail/`,
      query: { finPrdtCd: fin_prdt_cd },
    });
  } else {
    console.warn('상품 정보가 부족합니다.');
  }
};
const props = defineProps({
  subscribedProducts: {
    type: Array,
    default: () => [], // 빈 배열로 기본값 설정
  },
});
// 관리 모드 전체 토글
const isManagingAll = ref(false);

const toggleManageMode = () => {
  isManagingAll.value = !isManagingAll.value;
  subscribedProducts.value.forEach((product) => {
    product.isManaging = isManagingAll.value;
  });
};

// 관리 버튼 클릭 이벤트 (예: 관리 로직 추가)
const manageProduct = (id) => {
  alert(`상품 ID ${id} 관리 중`);
};
</script>

<template>
  <main class="flex flex-col items-center w-full max-w-4xl">
    <div class="w-full">
      <h2 class="mb-4 text-xl font-semibold">가입 상품 목록</h2>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <div
          v-for="product in props.subscribedProducts"
          :key="product.id"
          class="relative p-4 transition duration-200 rounded-lg shadow bg-gray-50 hover:shadow-lg"
          @click="navigateToProductDetail(product.type, product.fin_prdt_cd)"
        >
          <!-- 상품 정보 -->
          <h3 class="mb-2 text-lg font-bold text-blue-600">
            {{ product.fin_prdt_nm }}
          </h3>
          <p class="text-sm text-gray-700">
            은행이름:
            <span class="font-semibold">
              {{ product.kor_co_nm }}
            </span>
          </p>
          <p class="text-sm text-gray-700">
            만기:
            <span class="font-semibold">{{ product.mtrt_int }}</span>
          </p>
          <p class="mt-2 text-sm text-gray-600">
            {{ product.description }}
          </p>

          <!-- 관리 버튼: 관리 모드 활성화 시 나타남 -->
          <button
            v-if="product.isManaging"
            type="button"
            class="absolute p-2 text-white bg-red-500 rounded-full shadow-md top-2 right-2 hover:bg-red-600"
            @click="manageProduct(product.id)"
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
      </div>

      <!-- 상품 관리하기 버튼 -->
      <div class="flex justify-end w-full">
        <button
          type="button"
          class="px-6 py-2 text-sm font-semibold text-white transition duration-200 bg-green-500 rounded-lg shadow hover:bg-green-600"
          @click="toggleManageMode"
        >
          {{ isManagingAll ? '종료' : '상품 가입 관리' }}
        </button>
      </div>
    </div>
  </main>
</template>
