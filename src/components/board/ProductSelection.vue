<script setup>
import { ref, watch, onMounted } from 'vue';
import { finProductService } from '@/services/finProductService';
import FinanceCard from '@/components/finance/FinanceCard.vue';

const props = defineProps({
  type: String,
  productCode: String,
});

const emit = defineEmits(['update:type', 'update:product-code']);

const selectedType = ref('deposit');
const selectedProduct = ref(null);
const products = ref([]);
const isLoading = ref(false);
const showProductList = ref(false);
const showTypeList = ref(false);

const productTypes = [
  { value: 'deposit', label: '예금' },
  { value: 'savings', label: '적금' },
];

const { getAllFinProducts } = finProductService();

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    getAllFinProducts(
      selectedType.value,
      {
        topFinGrpNo: '020000',
        pageNo: '1',
      },
      3,
      (data) => {
        products.value = data.map((product) => ({
          code: product.fin_prdt_cd,
          name: product.fin_prdt_nm,
          fin_prdt_cd: product.fin_prdt_cd,
          fin_prdt_nm: product.fin_prdt_nm,
          ...product,
        }));
      },
      (error) => {
        console.error('상품 목록 조회 실패:', error);
        alert('상품 목록을 불러오는데 실패했습니다.');
      }
    );
  } finally {
    isLoading.value = false;
  }
};

const selectProduct = (product) => {
  selectedProduct.value = JSON.parse(JSON.stringify(product));
  emit('update:product-code', product.code);
  showProductList.value = false;
};

const selectType = (type) => {
  selectedType.value = type;
  showTypeList.value = false;
};

watch(selectedType, (newType) => {
  emit('update:type', newType.toUpperCase());
  selectedProduct.value = null;
  emit('update:product-code', '');
  fetchProducts();
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="mb-6">
    <label class="block mb-2 text-sm font-semibold text-gray-700">
      추천 금융상품
    </label>

    <div class="flex gap-4">
      <!-- 상품 유형 선택 -->
      <div class="relative w-1/3">
        <button
          @click="showTypeList = !showTypeList"
          class="w-full px-4 py-2 text-left border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          {{ productTypes.find((type) => type.value === selectedType)?.label }}
        </button>

        <div
          v-if="showTypeList"
          class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg"
        >
          <button
            v-for="type in productTypes"
            :key="type.value"
            @click="selectType(type.value)"
            class="w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- 상품 선택 -->
      <div class="relative w-2/3">
        <button
          @click="showProductList = !showProductList"
          :disabled="isLoading"
          class="w-full px-4 py-2 text-left border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <div v-if="isLoading" class="flex items-center justify-center gap-3">
            <div
              class="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent spinner"
            ></div>
            <p class="text-base font-medium text-gray-700">Loading...</p>
          </div>
          <span v-else>
            {{ selectedProduct?.name || '추천할 상품을 선택하세요' }}
          </span>
        </button>

        <div
          v-if="showProductList"
          class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <div v-if="isLoading" class="p-4 text-center text-gray-500">
            로딩중...
          </div>
          <button
            v-else
            v-for="product in products"
            :key="product.code"
            @click="selectProduct(product)"
            class="w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            {{ product.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- FinanceCard -->
    <div class="mt-4">
      <FinanceCard
        v-if="selectedProduct"
        :product="selectedProduct"
        :key="selectedProduct.code"
      />
    </div>
  </div>
</template>
<style scoped>
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
