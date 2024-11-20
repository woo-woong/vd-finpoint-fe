<script setup>
defineProps({
  submitText: {
    type: String,
    required: true,
  },
});

defineEmits(['submit', 'cancel']);
</script>

<template>
  <div class="flex justify-end gap-2">
    <button
      type="button"
      @click="$emit('submit')"
      class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
    >
      {{ submitText }}
    </button>
    <button
      type="button"
      @click="$emit('cancel')"
      class="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
    >
      취소
    </button>
  </div>
</template>
