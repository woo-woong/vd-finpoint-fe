<script setup>
import { defineProps, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
    required: false,
  },
});

const chartData = computed(() => {
  if (!props.options?.length) {
    return {
      labels: [],
      datasets: [],
    };
  }

  // 데이터 전처리
  const processedOptions = props.options.map((opt) => ({
    ...opt,
    save_trm: Number(opt.save_trm) || 0,
    intr_rate: Number(opt.intr_rate2) || Number(opt.intr_rate) || 0,
  }));

  // 모든 개월 수 추출 및 정렬
  const allTerms = Array.from(
    new Set(processedOptions.map((opt) => opt.save_trm))
  ).sort((a, b) => a - b);

  // 평균 라인 데이터 계산
  const averageData = allTerms.map((term) => {
    const termRates = processedOptions
      .filter((opt) => opt.save_trm === term)
      .map((opt) => opt.intr_rate);
    return termRates.length > 0
      ? termRates.reduce((a, b) => a + b) / termRates.length
      : null;
  });

  // 데이터셋 배열 시작을 평균 라인으로
  const datasets = [
    {
      label: '평균 금리',
      data: averageData,
      type: 'line',
      borderColor: '#FF0000',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#FF0000',
      order: 0, // 가장 위에 표시
    },
  ];

  // 상품별 데이터셋 생성
  const productDatasets = Object.values(
    processedOptions.reduce((acc, curr) => {
      if (!acc[curr.fin_prdt_cd]) {
        acc[curr.fin_prdt_cd] = {
          label: curr.fin_prdt_nm,
          data: allTerms.map((term) => {
            const match = processedOptions.find(
              (opt) =>
                opt.fin_prdt_cd === curr.fin_prdt_cd && opt.save_trm === term
            );
            return match ? match.intr_rate : null;
          }),
          backgroundColor: colors[Object.keys(acc).length % colors.length],
          borderColor: colors[Object.keys(acc).length % colors.length],
          borderWidth: 1,
          order: 1, // 평균선 아래에 표시
        };
      }
      return acc;
    }, {})
  );

  datasets.push(...productDatasets);

  return {
    labels: allTerms.map((term) => `${term}개월`),
    datasets,
  };
});

const colors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#a4de6c',
  '#d0ed57',
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          const value = context.parsed.y;
          return value != null
            ? `${context.dataset.label}: ${value.toFixed(2)}%`
            : '데이터 없음';
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: '금리 (%)',
      },
    },
    x: {
      title: {
        display: true,
        text: '저축 기간',
      },
    },
  },
};
</script>

<template>
  <div class="w-full h-64">
    <Bar
      v-if="props.options?.length"
      :data="chartData"
      :options="chartOptions"
    />
    <div v-else class="h-full flex items-center justify-center text-gray-500">
      가입한 상품이 없습니다.
    </div>
  </div>
</template>
