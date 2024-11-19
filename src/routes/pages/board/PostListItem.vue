<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: Number,
  title: String,
  author: String,
  created_at: String,
});
const formattedDate = computed(() => {
  if (!props.created_at) return '';

  const date = new Date(props.created_at);

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24시간 형식 사용
  });
});
</script>

<template>
  <tr class="hover:bg-gray-100">
    <td class="p-4 border-b">{{ id }}</td>
    <td class="p-4 border-b">
      <router-link
        :to="`/board/${id}`"
        class="text-blue-600 underline hover:text-blue-800"
      >
        {{ title }}
      </router-link>
    </td>
    <td class="p-4 border-b">{{ author }}</td>
    <td class="p-4 border-b">{{ formattedDate }}</td>
  </tr>
</template>
