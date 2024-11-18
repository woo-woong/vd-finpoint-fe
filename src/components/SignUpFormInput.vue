<!-- SignUpFormInput.vue -->
<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mb-4">
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :type="type"
      :id="id"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
</template>
