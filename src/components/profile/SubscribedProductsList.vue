<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { finProductService } from '@/services/finProductService';

const router = useRouter();
const { unsubscribeFinProduct } = finProductService();

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
};

// 로컬 상태로 구독 상품 목록 관리
const localSubscribedProducts = ref([...props.subscribedProducts]);

// props가 변경될 때 로컬 상태 업데이트
watch(
  () => props.subscribedProducts,
  (newProducts) => {
    localSubscribedProducts.value = [...newProducts];
  }
);

// 상품 가입 해제
const handleUnsubscribe = async (event, product) => {
  event.stopPropagation(); // 상세 페이지 이동 방지

  try {
    const productData = {
      fin_prdt_cd: product.fin_prdt_cd,
      type: product.type,
    };
    await unsubscribeFinProduct(productData, product.id);
    // 성공적으로 해제되면 로컬 상태에서 해당 상품 제거
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
  <div class="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 md:grid-cols-3">
    <div
      v-for="product in localSubscribedProducts"
      :key="product.id"
      class="relative p-4 transition duration-200 rounded-lg shadow bg-gray-50 hover:shadow-lg"
      @click="
        !isManagingAll &&
          navigateToProductDetail(product.type, product.fin_prdt_cd)
      "
    >
      <!-- 상품 정보 -->
      <div class="flex flex-col space-y-3">
        <!-- 상품명 -->
        <div class="flex items-start">
          <span
            class="w-20 px-2 py-1 text-xs font-medium text-center text-white rounded-full shrink-0"
            :class="product.type === 'DEPOSIT' ? 'bg-blue-600' : 'bg-blue-900'"
            >{{ product.type === 'DEPOSIT' ? '예금상품' : '적금상품' }}</span
          >
          <h3 class="ml-2 text-lg font-bold text-gray-600 truncate break-keep">
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
          <span class="ml-2 font-semibold text-gray-500 text-md">{{
            product.kor_co_nm
          }}</span>
        </div>

        <!-- 상품 정보 -->
        <div class="flex flex-col space-y-2">
          <!-- 공시 정보 -->
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span class="ml-2 text-sm text-gray-700"
              >공시 제출월:
              <span class="font-semibold"
                >{{ product.product_detail?.dcls_month.slice(0, 4) }}년
                {{ product.product_detail?.dcls_month.slice(4) }}월</span
              >
            </span>
          </div>

          <!-- 가입 정보 -->
          <div
            class="px-3 py-2 space-y-1 text-sm text-gray-600 bg-gray-100 rounded"
          >
            <p>
              <span class="font-medium break-keep">가입방법:</span>
              <span class="break-keep">
                {{ product.product_detail?.join_way }}
              </span>
            </p>
            <p>
              <span class="font-medium break-keep">가입대상:</span>
              <span class="break-keep">
                {{ product.product_detail?.join_member }}
              </span>
            </p>
            <p>
              <span class="font-medium break-keep">가입제한:</span>
              <span class="break-keep">
                {{
                  product.product_detail?.join_deny === '1'
                    ? '제한없음'
                    : product.product_detail?.join_deny === '2'
                      ? '서민전용'
                      : '일부제한'
                }}
              </span>
            </p>
          </div>

          <!-- 자세히 보기 오버레이 -->
          <div
            class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg opacity-0 cursor-pointer hover:opacity-100"
            :class="{
              'opacity-0 pointer-events-none': isManagingAll,
              'hover:opacity-100': !isManagingAll,
            }"
          >
            <span class="text-lg font-semibold text-white">자세히 보기 →</span>
          </div>
        </div>
      </div>

      <!-- 관리 버튼 -->
      <button
        type="button"
        class="absolute p-2 text-white transition-all duration-300 ease-in-out bg-red-500 rounded-full shadow-md bottom-2 right-2 hover:bg-red-600"
        :class="{
          'opacity-0 pointer-events-none translate-y-1': !isManagingAll,
          'opacity-100 pointer-events-auto translate-y-0': isManagingAll,
        }"
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
  </div>

  <!-- 상품 관리하기 버튼 -->
  <div class="flex justify-end w-full">
    <button
      type="button"
      class="px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
      @click="toggleManageMode"
    >
      {{ isManagingAll ? '종료' : '상품 가입 관리' }}
    </button>
  </div>
</template>

<style scoped>
button {
  transition: all 0.3s ease-in-out;
}
</style>
