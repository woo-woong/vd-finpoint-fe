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
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  options: {
    type: Array,
    default: () => [], // Provide an empty array as default
    required: false, // Make it optional
  },
});

const chartData = computed(() => {
  if (!props.options || props.options.length === 0) {
    return {
      labels: [],
      datasets: [],
    };
  }

  // 상품별로 그룹화
  const groupedByProduct = props.options.reduce((acc, curr) => {
    const key = curr.fin_prdt_cd;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});

  // 모든 개월 수 추출 (중복 제거 및 정렬)
  const allTerms = [...new Set(props.options.map((opt) => opt.save_trm))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  // 각 상품별로 데이터셋 생성
  const datasets = Object.entries(groupedByProduct).map(
    ([productCode, options], index) => {
      const colors = [
        '#8884d8',
        '#82ca9d',
        '#ffc658',
        '#ff8042',
        '#a4de6c',
        '#d0ed57',
      ];
      return {
        label: options[0].fin_prdt_nm,
        backgroundColor: colors[index % colors.length],
        data: allTerms.map((term) => {
          const option = options.find((opt) => opt.save_trm === term);
          return option ? option.intr_rate : null;
        }),
      };
    }
  );

  return {
    labels: allTerms.map((term) => `${term}개월`),
    datasets,
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.parsed.y}%`;
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
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
