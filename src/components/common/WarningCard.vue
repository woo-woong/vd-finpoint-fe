<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <p
    class="absolute right-0 text-sm text-red-500 font-medium bg-red-50 p-3 rounded-md border border-red-200"
  >
    {{ message }}
  </p>
</template>
