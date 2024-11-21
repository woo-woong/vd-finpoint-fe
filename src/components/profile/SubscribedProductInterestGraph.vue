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
  // Only map if options exists and has items
  if (!props.options || props.options.length === 0) {
    return {
      labels: [],
      datasets: [
        {
          label: '저축 금리',
          backgroundColor: '#8884d8',
          data: [],
        },
        {
          label: '최고 우대 금리',
          backgroundColor: '#82ca9d',
          data: [],
        },
      ],
    };
  }

  return {
    labels: props.options.map((option) => option.save_trm),
    datasets: [
      {
        label: '저축 금리',
        backgroundColor: '#8884d8',
        data: props.options.map((option) => option.intr_rate),
      },
      {
        label: '최고 우대 금리',
        backgroundColor: '#82ca9d',
        data: props.options.map((option) => option.intr_rate2),
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="w-full h-64">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
