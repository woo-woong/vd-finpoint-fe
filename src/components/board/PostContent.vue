<script setup>
defineProps({
  modelValue: String,
});
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mb-8">
    <label for="content" class="block mb-2 text-sm font-semibold text-gray-700">
      내용
    </label>
    <textarea
      id="content"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="8"
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      placeholder="내용을 입력하세요"
    />
  </div>
</template>
