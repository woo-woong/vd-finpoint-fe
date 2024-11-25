<script setup>
import { useDate } from '@/hooks/common/useDate';

const props = defineProps({
  id: Number,
  title: String,
  author: String,
  created_at: String,
  likeCount: Number,
});
const formattedDate = useDate(props.created_at);
const maskedAuthor = props.author.slice(0, 1) + '**';
</script>

<template>
  <tr class="hover:bg-gray-100">
    <td class="p-4 border-b">{{ likeCount }}</td>
    <td class="p-4 border-b">{{ id }}</td>
    <td class="p-4 border-b">
      <router-link
        :to="`/board/${id}`"
        class="text-blue-600 hover:text-blue-800"
      >
        {{ title }}
      </router-link>
    </td>
    <td class="p-4 border-b">{{ maskedAuthor }}</td>
    <td class="p-4 border-b">{{ formattedDate }}</td>
  </tr>
</template>
