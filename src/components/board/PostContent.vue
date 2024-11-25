<script setup>
import { toast } from 'vue-sonner';
import { computed } from 'vue';

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const currentLength = computed(() => props.modelValue?.length || 0);

const handleInput = (event) => {
  const content = event.target.value;
  if (content.length > 1000) {
    toast.error('내용은 1000자를 초과할 수 없습니다.', {
      style: {
        background: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #dc2626',
      },
    });
    return;
  }
  emit('update:modelValue', content);
};
</script>

<template>
  <div class="mb-8">
    <div class="flex justify-between items-center mb-2">
      <label for="content" class="text-sm font-semibold text-gray-700">
        내용 (1000자 이내)
      </label>
      <span class="text-sm text-gray-500">{{ currentLength }}/1000자</span>
    </div>
    <textarea
      id="content"
      :value="modelValue"
      @input="handleInput"
      rows="8"
      :disabled="disabled"
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
      placeholder="내용을 입력하세요 (1000자 이내)"
      maxlength="1000"
    />
  </div>
</template>
