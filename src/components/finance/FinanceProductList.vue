<script setup>
import { ref, watchEffect } from 'vue';
import useFinProducts from '@hooks/finance/useFinProducts';
import FinanceCard from '@components/finance/FinanceCard.vue';
import Loading from '../common/Loading.vue';

// Props 정의
const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  searchParams: {
    type: Object,
    required: true,
  },
});

// 데이터 구조 및 함수 불러오기
const { path, searchParams } = props;
const { finProducts, error, visibleCount, isLoading, loadMoreProducts } =
  useFinProducts({
    path,
    searchParams,
    defaultVisibleCount: 3,
  });
</script>

<template>
  <div>
    <!-- 데이터 로딩 및 에러 처리 -->
    <div v-if="error">
      <p>Failed to load data: {{ error.message }}</p>
    </div>
    <div v-else-if="isLoading">
      <Loading />
    </div>

    <!-- 제품 목록 렌더링 -->
    <div v-else>
      <div v-if="!finProducts || finProducts.length === 0">
        <p>No products available.</p>
      </div>

      <div v-else>
        <!-- 배열인지 확인 후 제품 목록 표시 -->
        <div v-if="Array.isArray(finProducts)">
          <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            <FinanceCard
              v-for="product in finProducts.slice(0, visibleCount)"
              :key="product.finPrdtCd"
              :product="product"
            />
          </div>
        </div>
        <div v-else>
          <p>Invalid data format</p>
        </div>

        <!-- 'more' 버튼 -->
        <div class="flex justify-center">
          <button
            v-if="finProducts.length > visibleCount"
            @click="loadMoreProducts"
            class="p-5 font-black rounded-md shadow-md"
          >
            more
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
