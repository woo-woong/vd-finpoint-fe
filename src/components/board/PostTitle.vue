<script setup>
defineProps({
  modelValue: String,
});
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mb-6">
    <label for="title" class="block mb-2 text-sm font-semibold text-gray-700">
      제목
    </label>
    <input
      id="title"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      placeholder="제목을 입력하세요"
    />
  </div>
</template>
