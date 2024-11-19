<script setup>
import { ref, watch, onMounted } from 'vue';
import exchangeService from '@/services/exchangeService';
const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

const exchangeRates = ref([]);
const fromCurrency = ref('');
const toCurrency = ref('');
const fromAmount = ref('');
const toAmount = ref('');
const currencyUnitMap = ref({});

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

// 통화명에서 국가명만 추출하는 함수
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

// 숫자 포맷팅 함수
const formatNumber = (value, currency) => {
  const num = parseFloat(value);
  return `${currencySymbols[getCountryName(currency)] || ''} ${value ? num.toLocaleString() : ''}`;
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
  } catch (err) {
    console.error(err);
  }
};

const calculateExchange = async () => {
  if (!fromCurrency.value || !toCurrency.value) return;
  // fromAmount가 비어있거나 0일 경우
  if (!fromAmount.value || parseFloat(fromAmount.value) === 0) {
    toAmount.value = 0;
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
  <div
    class="flex flex-col max-w-md gap-4 p-6 mx-auto rounded-lg shadow-md bg-blue-50"
  >
    <!-- 출발 통화 -->
    <div class="flex flex-col gap-2">
      <div class="flex flex-row items-center justify-center gap-2">
        <select
          v-model="fromCurrency"
          class="w-[60%] p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option
            v-for="rate in exchangeRates"
            :key="rate.cur_unit"
            :value="rate.cur_nm"
          >
            {{ getCountryName(rate.cur_nm) }}
          </option>
        </select>
        <input
          type="number"
          v-model="fromAmount"
          placeholder="금액 입력"
          class="w-full p-2 text-right border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="text-center w-[20%] p-2 bg-gray-300 rounded-md">
          <p class="font-semibold">
            {{ currencySymbols[getCountryName(fromCurrency)] || '' }}
          </p>
        </div>
      </div>
      <div class="text-right text-gray-600">
        {{ formatNumber(fromAmount, fromCurrency) }}
      </div>
    </div>

    <!-- 등호 표시 -->
    <div class="flex items-center justify-center">
      <div class="relative w-16 h-8">
        <div class="absolute w-full h-1 bg-gray-400"></div>
        <div class="absolute w-full h-1 translate-y-2 bg-gray-400"></div>
      </div>
    </div>

    <!-- 도착 통화 -->
    <div class="flex flex-col gap-2">
      <div class="flex flex-row items-center justify-center gap-2">
        <select
          v-model="toCurrency"
          class="w-[60%] p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option
            v-for="rate in exchangeRates"
            :key="rate.cur_unit"
            :value="rate.cur_nm"
          >
            {{ getCountryName(rate.cur_nm) }}
          </option>
        </select>
        <input
          type="text"
          :value="toAmount"
          readonly
          class="w-full p-2 text-right bg-gray-100 border border-blue-300 rounded-lg"
        />
        <div class="text-center w-[20%] p-2 bg-gray-300 rounded-md">
          <p class="font-semibold">
            {{ currencySymbols[getCountryName(toCurrency)] || '' }}
          </p>
        </div>
      </div>
      <div class="text-right text-gray-600">
        {{ formatNumber(toAmount, toCurrency) }}
      </div>
    </div>
  </div>
</template>
