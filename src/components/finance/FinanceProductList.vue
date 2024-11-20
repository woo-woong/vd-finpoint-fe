<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { finProductService } from '@/services/finProductService';
import Loading from '../common/Loading.vue';

const router = useRouter();

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

// 상태 초기화
const finProducts = ref([]);
const error = ref(null);
const visibleCount = ref(10);
const isLoading = ref(true);

// finProductService에서 함수 가져오기
const { getAllFinProducts } = finProductService();

// getAllFinProducts 호출 및 데이터 설정 부분 수정
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const data = await getAllFinProducts(props.path, props.searchParams);
    finProducts.value = data;
    isLoading.value = false;
  } catch (err) {
    error.value = err;
    isLoading.value = false;
  }
};

// loadMoreProducts 함수 추가
const loadMoreProducts = () => {
  if (visibleCount.value < filteredProducts.value.length) {
    visibleCount.value += 10;
  }
};

// watch 추가
watch(
  [() => props.path, () => props.searchParams],
  () => {
    fetchProducts();
  },
  { immediate: true }
);

// onMounted 제거 (watch의 immediate: true로 대체)

// 검색 조건을 위한 상태 관리
const selectedBank = ref('전체');
const selectedPeriod = ref('전체기간');
const searchQuery = ref('');

// computed 속성들도 null 체크 추가
const bankOptions = computed(() => {
  if (!finProducts.value) return ['전체'];
  const banks = [
    ...new Set(finProducts.value.map((product) => product.kor_co_nm)),
  ];
  return ['전체', ...banks];
});

// 예치 기간 옵션
const periodOptions = ['전체기간', '6개월', '12개월', '24개월', '36개월'];

// 금리 정보를 가져오는 함수
const getInterestRate = (product, term) => {
  if (!product?.options) return '-';
  const option = product.options.find(
    (opt) => opt.save_trm === term.toString()
  );
  return option?.intr_rate ? option.intr_rate.toFixed(2) : '-';
};

// 필터링된 상품 목록
const filteredProducts = computed(() => {
  if (!finProducts.value) return [];

  return finProducts.value
    .filter((product) => {
      const bankMatch =
        selectedBank.value === '전체' ||
        product.kor_co_nm === selectedBank.value;
      const nameMatch = product.fin_prdt_nm
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

      let periodMatch = true;
      if (selectedPeriod.value !== '전체기간') {
        const period = selectedPeriod.value.replace('개월', '');
        periodMatch = product.options?.some(
          (opt) =>
            opt.save_trm === period &&
            opt.intr_rate != null &&
            opt.intr_rate > 0
        );
      }

      return bankMatch && nameMatch && periodMatch;
    })
    .sort((a, b) => {
      const rateA = Number(getInterestRate(a, '12').replace('-', '0')) || 0;
      const rateB = Number(getInterestRate(b, '12').replace('-', '0')) || 0;
      return rateB - rateA;
    });
});

// 검색 실행
const handleSearch = () => {
  // 검색 로직 구현
};

const navigateToProductDetail = (finPrdtCd) => {
  router.push({ path: `/${props.path}/detail`, query: { finPrdtCd } });
};
</script>

<template>
  <div class="w-full p-4">
    <!-- 검색 필터 섹션 -->
    <div class="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
        <!-- 은행 선택 -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >은행 선택</label
          >
          <select
            v-model="selectedBank"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="bank in bankOptions" :key="bank" :value="bank">
              {{ bank }}
            </option>
          </select>
        </div>

        <!-- 예치 기간 -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >예치 기간</label
          >
          <select
            v-model="selectedPeriod"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option
              v-for="period in periodOptions"
              :key="period"
              :value="period"
            >
              {{ period }}
            </option>
          </select>
        </div>

        <!-- 검색어 입력 -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >상품명 검색</label
          >
          <div class="flex">
            <input
              v-model="searchQuery"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="상품명을 입력하세요"
            />
            <button
              @click="handleSearch"
              class="px-4 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 테이블 섹션 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div v-if="error" class="p-4 text-red-600">
        <p>데이터를 불러오는데 실패했습니다: {{ error.message }}</p>
      </div>

      <div v-else-if="isLoading" class="p-4">
        <Loading />
      </div>

      <div v-else-if="filteredProducts.length === 0" class="p-4">
        <p>검색 결과가 없습니다.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full table-fixed divide-y divide-gray-200">
          <colgroup>
            <col class="w-[12%]" />
            <!-- 공시 제출월 -->
            <col class="w-[15%]" />
            <!-- 금융회사명 -->
            <col class="w-[31%]" />
            <!-- 상품명 -->
            <col class="w-[10.5%]" />
            <!-- 6개월 -->
            <col class="w-[10.5%]" />
            <!-- 12개월 -->
            <col class="w-[10.5%]" />
            <!-- 24개월 -->
            <col class="w-[10.5%]" />
            <!-- 36개월 -->
          </colgroup>

          <thead class="bg-gray-50">
            <tr>
              <th
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500"
              >
                공시 제출월
              </th>
              <th
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500"
              >
                금융회사명
              </th>
              <th
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500"
              >
                상품명
              </th>
              <th
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500"
              >
                6개월
              </th>
              <th
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500"
              >
                12개월
              </th>
              <th
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500"
              >
                24개월
              </th>
              <th
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500"
              >
                36개월
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="product in filteredProducts.slice(0, visibleCount)"
              :key="product.fin_prdt_cd"
              class="hover:bg-gray-50"
            >
              <td class="p-4 text-center">
                <div class="truncate">{{ product.dcls_month }}</div>
              </td>
              <td class="p-4 text-center">
                <div class="truncate">{{ product.kor_co_nm }}</div>
              </td>
              <td class="p-4">
                <div class="truncate">
                  <span
                    class="text-blue-600 cursor-pointer"
                    @click="navigateToProductDetail(product.fin_prdt_cd)"
                    >{{ product.fin_prdt_nm }}</span
                  >
                </div>
              </td>
              <td class="p-4 text-center">
                <div class="truncate">{{ getInterestRate(product, '6') }}</div>
              </td>
              <td class="p-4 text-center">
                <div class="truncate">{{ getInterestRate(product, '12') }}</div>
              </td>
              <td class="p-4 text-center">
                <div class="truncate">{{ getInterestRate(product, '24') }}</div>
              </td>
              <td class="p-4 text-center">
                <div class="truncate">{{ getInterestRate(product, '36') }}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 더보기 버튼 -->
        <div class="flex justify-center p-4">
          <button
            v-if="filteredProducts.length > visibleCount"
            @click="loadMoreProducts"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            더보기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
