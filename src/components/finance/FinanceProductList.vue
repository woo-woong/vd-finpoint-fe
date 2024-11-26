<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { finProductService } from '@/services/finProductService';
import { useFinanceNavigation } from '@/hooks/navigator/useFinanceNavigation';
import Loading from '../common/Loading.vue';

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

const { navigateToFinProductDetail } = useFinanceNavigation();

// 상태 초기화
const finProducts = ref([]);
const error = ref(null);
const visibleCount = ref(10);
const isLoading = ref(true);

// 정렬 상태 추가
const sortField = ref('12'); // 기본값 12개월
const sortDirection = ref('desc'); // 기본값 내림차순

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

// 검색 조건을 위한 상태 관리
const selectedBank = ref('전체');
const selectedPeriod = ref('전체기간');
const searchQuery = ref('');
const appliedSearchQuery = ref('');

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

// 정렬 토글 함수 추가
const toggleSort = (period) => {
  if (sortField.value === period) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = period;
    sortDirection.value = 'desc';
  }
};

// 가입 상품 필터링을 위한 상태 추가
const showWishedOnly = ref(false);

// 컴포넌트가 마운트될 때마다 필터 상태 초기화
onMounted(() => {
  showWishedOnly.value = false;
});

// showWishedOnly가 변경될 때도 데이터를 다시 불러오도록 watch 추가
watch(showWishedOnly, () => {
  fetchProducts();
});

// 기존 watch와 함께 사용
watch(
  [() => props.path, () => props.searchParams],
  () => {
    fetchProducts();
  },
  { immediate: true }
);

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
        .includes(appliedSearchQuery.value.toLowerCase());
      const periodMatch =
        selectedPeriod.value === '전체기간' ||
        product.options?.some(
          (opt) => opt.save_trm === selectedPeriod.value.replace('개월', '')
        );

      // 가입한 상품 필터링 추가
      const wishedMatch = !showWishedOnly.value || product.is_wished;

      return bankMatch && nameMatch && periodMatch && wishedMatch;
    })
    .sort((a, b) => {
      const rateA =
        Number(getInterestRate(a, sortField.value).replace('-', '0')) || 0;
      const rateB =
        Number(getInterestRate(b, sortField.value).replace('-', '0')) || 0;
      return sortDirection.value === 'asc' ? rateA - rateB : rateB - rateA;
    });
});

// 검색 실행
const handleSearch = () => {
  appliedSearchQuery.value = searchQuery.value.trim();
};
</script>

<template>
  <div class="w-full p-4">
    <!-- 검색 필터 섹션 -->
    <div class="mb-6 bg-white border border-gray-200 rounded-lg">
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
              @keyup.enter="handleSearch"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="상품명을 입력하세요"
            />
            <button
              @click="handleSearch"
              class="px-4 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 가입 상품 필터링 -->
    <div
      class="flex items-center gap-2 px-4 py-3 mb-4 bg-white border border-gray-200 rounded-lg"
    >
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="showWishedOnly" class="sr-only peer" />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
        ></div>
      </label>
      <span class="text-sm font-medium text-gray-700">가입한 상품만 보기</span>
      <div class="flex items-center ml-2">
        <span class="text-xs text-gray-500">
          내가 가입한 상품들만 모아볼 수 있어요
        </span>
      </div>
    </div>
    <!-- 테이블 섹션 -->
    <div class="bg-white border border-gray-200 rounded-lg">
      <div v-if="isLoading" class="p-4">
        <Loading message="상품 데이터를 불러오는 중입니다..." />
      </div>

      <div v-else-if="error" class="flex flex-col items-center p-4">
        <p>검색 결과가 없습니다.</p>
        <button
          @click="fetchProducts"
          class="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          다시 검색하기
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <!-- 데이터가 없을 경우 표시할 메시지 -->
        <div
          v-if="filteredProducts.length === 0"
          class="flex flex-col items-center justify-center p-8"
        >
          <p class="text-lg text-gray-600">검색 결과가 없습니다.</p>
          <p class="mt-2 text-sm text-gray-500">
            검색어나 필터 조건을 변경해보세요.
          </p>
        </div>

        <!-- 더이터가 있을 경우 테이블 표시 -->
        <table v-else class="w-full divide-y divide-gray-200 table-fixed">
          <colgroup>
            <col class="w-[12%]" />
            <col class="w-[15%]" />
            <col class="w-[31%]" />
            <col class="w-[10.5%]" />
            <col class="w-[10.5%]" />
            <col class="w-[10.5%]" />
            <col class="w-[10.5%]" />
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
                @click="toggleSort('6')"
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500 cursor-pointer hover:bg-gray-100"
              >
                6개월
                <span v-if="sortField === '6'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th
                @click="toggleSort('12')"
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500 cursor-pointer hover:bg-gray-100"
              >
                12개월
                <span v-if="sortField === '12'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th
                @click="toggleSort('24')"
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500 cursor-pointer hover:bg-gray-100"
              >
                24개월
                <span v-if="sortField === '24'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th
                @click="toggleSort('36')"
                class="p-4 text-sm font-medium tracking-wider text-center text-gray-500 cursor-pointer hover:bg-gray-100"
              >
                36개월
                <span v-if="sortField === '36'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(product, index) in filteredProducts.slice(
                0,
                visibleCount
              )"
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
                    class="text-blue-600 cursor-pointer hover:underline"
                    @click="
                      navigateToFinProductDetail(
                        props.path,
                        product.fin_prdt_cd
                      )
                    "
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
        <div
          v-if="filteredProducts.length > visibleCount"
          class="flex justify-center p-4"
        >
          <button
            @click="loadMoreProducts"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            더보기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
