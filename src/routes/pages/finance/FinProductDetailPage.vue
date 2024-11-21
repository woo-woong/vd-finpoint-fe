<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { finProductService } from '@/services/finProductService';
import FinanceSubScriptionBtn from '@/components/finance/FinanceSubScriptionBtn.vue';
import Loading from '@/components/common/Loading.vue';

const route = useRoute();
const product = ref(null);
const isLoading = ref(false);
const initialIsSubscribed = ref(false);
const { getFinProduct } = finProductService();

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
    <Loading v-if="isLoading" />
    <div v-else>
      <!-- 상품 헤더 -->
      <div class="mb-2">
        <div class="flex items-center justify-between">
          <h1 class="mb-2 text-2xl font-bold">{{ product?.fin_prdt_nm }}</h1>
          <FinanceSubScriptionBtn
            :initialIsSubscribed="initialIsSubscribed"
            :inititalWishlistId="product?.wishlist_id || null"
            :product="product"
            :service="service"
            @update:subscribed="updateSubscribedStatus"
          />
        </div>
        <p class="text-gray-600">{{ product?.kor_co_nm }}</p>
      </div>

      <!-- 상품 상세 정보 -->
      <div class="p-6 bg-white rounded-lg shadow-md">
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
      </div>
    </div>
  </div>
</template>
