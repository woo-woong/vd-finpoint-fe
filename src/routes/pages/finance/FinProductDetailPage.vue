<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { finProductService } from '@/services/finProductService';
import FinanceSubScriptionBtn from '@/components/finance/FinanceSubScriptionBtn.vue';
import Loading from '@/components/common/Loading.vue';
import BackBtn from '@/components/common/BackBtn.vue';
import { useFinanceNavigation } from '@/hooks/navigator/useFinanceNavigation';

const route = useRoute();
const product = ref(null);
const isLoading = ref(false);
const initialIsSubscribed = ref(false);
const { getFinProduct } = finProductService();
const { navigateToOfficialProductHomepage } = useFinanceNavigation();
const formattedJoinDeny = ref('');
// service 파라미터를 통해 상품 종류 구분 (예: deposit, savings 등)
const service = route.params.service;

const updateSubscribedStatus = (status) => {
  initialIsSubscribed.value = status;
};

onMounted(async () => {
  try {
    isLoading.value = true;
    // 상품 ID는 쿼리 파라미터로 전달받음
    const finPrdtCd = route.query.finPrdtCd;

    // API 호출 시 상품 코드를 path parameter로 전달
    const response = await getFinProduct(service, finPrdtCd);
    product.value = response;
    initialIsSubscribed.value = response.is_subscribed;

    if (product.value?.join_deny) {
      if (product.value.join_deny === '1') {
        formattedJoinDeny.value = '제한 없음';
      } else if (product.value.join_deny === '2') {
        formattedJoinDeny.value = '서민 전용';
      } else {
        formattedJoinDeny.value = '일부 제한';
      }
    }
  } catch (error) {
    console.error('상품 상세 정보 조회 실패:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <div class="w-full p-6 mx-auto">
    <Loading
      class="h-[800px]"
      v-if="isLoading"
      message="상품 상세 정보를 불러오는 중입니다..."
    />

    <div v-else>
      <div class="flex justify-end w-full mb-4">
        <BackBtn />
      </div>
      <!-- 상품 헤더 -->
      <div class="mb-2">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-2xl font-bold">{{ product?.fin_prdt_nm }}</h1>
          <FinanceSubScriptionBtn
            :initialIsSubscribed="initialIsSubscribed"
            :inititalWishlistId="product?.wishlist_id || null"
            :product="product"
            :service="service"
            @update:subscribed="updateSubscribedStatus"
          />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <p class="mb-2 text-gray-600">{{ product?.kor_co_nm }}</p>
            <a
              v-if="product?.kor_co_nm"
              @click="navigateToOfficialProductHomepage(product?.kor_co_nm)"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 transition-colors rounded-md cursor-pointer bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              target="_blank"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              공식 홈페이지 방문
            </a>
          </div>
          <p
            class="p-3 text-sm font-medium text-red-500 border border-red-200 rounded-md bg-red-50"
          >
            ⚠️ 주의: 가입 및 가입 취소는 진행 중 취소가 불가능합니다.<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;신중히 결정해주시기 바랍니다.
          </p>
        </div>
      </div>

      <!-- 상품 상세 정보 -->
      <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <!-- 기본 정보 테이블 -->
        <table class="w-full mb-8">
          <tbody>
            <tr class="border-b">
              <td class="w-1/3 py-3 text-gray-600">공시 제출월</td>
              <td class="py-3 font-medium">{{ product?.dcls_month }}</td>
            </tr>
            <tr class="border-b">
              <td class="py-3 text-gray-600">금융회사명</td>
              <td class="py-3 font-medium">{{ product?.kor_co_nm }}</td>
            </tr>
            <tr class="border-b">
              <td class="py-3 text-gray-600">상품명</td>
              <td class="py-3 font-medium">{{ product?.fin_prdt_nm }}</td>
            </tr>
            <tr class="border-b">
              <td class="py-3 text-gray-600">가입방법</td>
              <td class="py-3 font-medium">{{ product?.join_way }}</td>
            </tr>
            <tr class="border-b">
              <td class="py-3 text-gray-600">가입대상</td>
              <td class="py-3 font-medium">{{ product?.join_member }}</td>
            </tr>
            <tr class="border-b">
              <td class="py-3 text-gray-600">가입제한</td>
              <td class="py-3 font-medium">{{ formattedJoinDeny }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 이자율 정보 -->
        <div class="p-6 mb-2 rounded-lg bg-blue-50">
          <h2 class="mb-4 text-lg font-bold text-blue-800">만기 후 이자율</h2>
          <div class="space-y-4">
            <p class="text-gray-600 whitespace-pre-line">
              {{ product?.mtrt_int }}
            </p>
          </div>
        </div>

        <!-- 기타 유의사항 -->
        <div class="p-6 rounded-lg bg-gray-50">
          <h2 class="mb-4 text-lg font-bold text-gray-800">유의사항</h2>
          <p class="text-gray-600 whitespace-pre-line">
            {{ product?.etc_note }}
          </p>
        </div>
        <!-- 재요청 -->
        <div class="flex justify-center mt-4">
          <button
            v-if="!product"
            @click="getFinProduct(service, product?.fin_prdt_cd)"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            재요청
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
