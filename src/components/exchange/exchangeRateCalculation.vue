<script setup>
import { ref, watch, onMounted } from 'vue';
import { exchangeService } from '@/services/exchangeService';
import { ArrowDownUp, ArrowRight } from 'lucide-vue-next';

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

const exchangeRates = ref([]);
const fromCurrency = ref('');
const toCurrency = ref('');
const fromAmount = ref('');
const displayAmount = ref(''); // 표시용 금액
const toAmount = ref('');
const currencyUnitMap = ref({});
const lastUpdated = ref(new Date());

// 통화 심볼 매핑
const currencySymbols = {
  아랍에미리트: 'د.إ',
  호주: 'A$',
  바레인: 'BD',
  브루나이: 'B$',
  캐나다: 'C$',
  스위스: 'Fr.',
  중국: '¥',
  덴마아크: 'kr.',
  EU: '€',
  영국: '£',
  홍콩: 'HK$',
  인도네시아: 'Rp',
  일본: '¥',
  한국: '₩',
  쿠웨이트: 'KD',
  말레이시아: 'RM',
  노르웨이: 'kr',
  뉴질랜드: 'NZ$',
  사우디: '﷼',
  스웨덴: 'kr',
  싱가포르: 'S$',
  태국: '฿',
  미국: '$',
};

const getCountryName = (fullName) => {
  const countryMap = {
    '아랍에미리트 디르함': '아랍에미리트',
    '호주 달러': '호주',
    '바레인 디나르': '바레인',
    '브루나이 달러': '브루나이',
    '캐나다 달러': '캐나다',
    '스위스 프랑': '스위스',
    위안화: '중국',
    '덴마아크 크로네': '덴마아크',
    유로: 'EU',
    '영국 파운드': '영국',
    '홍콩 달러': '홍콩',
    '인도네시아 루피아': '인도네시아',
    '일본 옌': '일본',
    '한국 원': '한국',
    '쿠웨이트 디나르': '쿠웨이트',
    '말레이지아 링기트': '말레이시아',
    '노르웨이 크로네': '노르웨이',
    '뉴질랜드 달러': '뉴질랜드',
    '사우디 리얄': '사우디',
    '스웨덴 크로나': '스웨덴',
    '싱가포르 달러': '싱가포르',
    '태국 바트': '태국',
    '미국 달러': '미국',
  };
  return countryMap[fullName] || fullName;
};

const formatNumber = (value, currency) => {
  const num = parseFloat(value);
  if (!value || isNaN(num)) return '';
  return `${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// 입력값 포맷팅 함수
const formatInput = (value) => {
  if (!value) return '';
  // 숫자와 소수점만 남기고 모두 제거
  const number = value.replace(/[^\d.]/g, '');
  // 소수점은 하나만 허용
  const parts = number.split('.');
  if (parts.length > 2) {
    parts.splice(2, parts.length - 2);
  }
  // 소수점 이하 2자리까지만 허용
  if (parts[1]) {
    parts[1] = parts[1].slice(0, 2);
  }
  // 정수 부분에 천 단위 구분자 추가
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

// 포맷된 문자열에서 숫자만 추출
const unformatNumber = (value) => {
  return value.replace(/[^\d.]/g, '');
};

const handleAmountInput = (event) => {
  const value = event.target.value;
  const unformattedValue = unformatNumber(value);
  fromAmount.value = unformattedValue; // 계산용 값 (숫자만)
  displayAmount.value = formatInput(unformattedValue); // 표시용 값 (포맷됨)
};

const getExchangeRate = () => {
  if (
    !fromCurrency.value ||
    !toCurrency.value ||
    !toAmount.value ||
    !fromAmount.value
  )
    return '';
  const rate = (
    parseFloat(toAmount.value) / parseFloat(fromAmount.value)
  ).toFixed(4);
  return `1 ${currencySymbols[getCountryName(fromCurrency.value)]} = ${rate} ${
    currencySymbols[getCountryName(toCurrency.value)]
  }`;
};

const swapCurrencies = () => {
  [fromCurrency.value, toCurrency.value] = [
    toCurrency.value,
    fromCurrency.value,
  ];
  calculateExchange();
};

const fetchExchangeRateData = async () => {
  try {
    const response = await exchangeService();
    exchangeRates.value = response;

    response.forEach((rate) => {
      currencyUnitMap.value[rate.cur_nm] = rate.cur_unit;
    });

    fromCurrency.value =
      response.find((rate) => rate.cur_nm === '미국 달러')?.cur_nm ||
      response[0]?.cur_nm;
    toCurrency.value =
      response.find((rate) => rate.cur_nm === '한국 원')?.cur_nm ||
      response[0]?.cur_nm;
    lastUpdated.value = new Date();
  } catch (err) {
    console.error(err);
  } finally {
  }
};

const calculateExchange = async () => {
  if (
    !fromCurrency.value ||
    !toCurrency.value ||
    !fromAmount.value ||
    parseFloat(fromAmount.value) === 0
  ) {
    toAmount.value = '';
    return;
  }

  try {
    const fromUnit = currencyUnitMap.value[fromCurrency.value];
    const toUnit = currencyUnitMap.value[toCurrency.value];

    const response = await fetch(
      `${API_URL}exchange/calculate/?from=${fromUnit}&to=${toUnit}&amount=${fromAmount.value}`
    );
    const data = await response.json();
    toAmount.value = data.result;
  } catch (err) {
    console.error('환율 계산 중 오류 발생:', err);
  } finally {
  }
};

watch([fromAmount, fromCurrency, toCurrency], () => {
  calculateExchange();
});

onMounted(() => {
  fetchExchangeRateData();
});
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <!-- 카드 헤더 -->
    <div class="p-4 bg-white border-b rounded-t-xl">
      <p class="mt-0.5 text-sm text-gray-500">
        최종 업데이트: {{ lastUpdated.toLocaleString() }}
      </p>
    </div>

    <!-- 메인 컨버터 섹션 -->
    <div class="flex-1 p-4 bg-white shadow-lg rounded-b-xl">
      <!-- From Currency -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">출발 통화</label>
        <div class="flex items-center gap-2">
          <div class="w-1/3">
            <select
              v-model="fromCurrency"
              class="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                v-for="rate in exchangeRates"
                :key="rate.cur_unit"
                :value="rate.cur_nm"
              >
                {{ getCountryName(rate.cur_nm) }}
              </option>
            </select>
          </div>
          <div class="flex-1">
            <div class="relative">
              <span
                class="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2"
              >
                {{ currencySymbols[getCountryName(fromCurrency)] }}
              </span>
              <input
                type="text"
                :value="displayAmount"
                @input="handleAmountInput"
                placeholder="0.00"
                class="w-full p-2 pl-8 text-right border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Swap Button -->
      <div class="flex justify-center my-2">
        <button
          @click="swapCurrencies"
          class="p-1 transition-colors rounded-full hover:bg-gray-100"
          title="통화 교환"
        >
          <ArrowDownUp class="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <!-- To Currency -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">도착 통화</label>
        <div class="flex items-center gap-2">
          <div class="w-1/3">
            <select
              v-model="toCurrency"
              class="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                v-for="rate in exchangeRates"
                :key="rate.cur_unit"
                :value="rate.cur_nm"
              >
                {{ getCountryName(rate.cur_nm) }}
              </option>
            </select>
          </div>
          <div class="flex-1">
            <div class="relative">
              <span
                class="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2"
              >
                {{ currencySymbols[getCountryName(toCurrency)] }}
              </span>
              <input
                type="text"
                :value="formatNumber(toAmount, toCurrency)"
                readonly
                class="w-full p-2 pl-8 text-right border border-gray-200 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Exchange Rate Display -->
      <div class="p-3 mt-4 rounded-lg bg-gray-50">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">환율</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">{{ getExchangeRate() }}</span>
            <ArrowRight class="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
