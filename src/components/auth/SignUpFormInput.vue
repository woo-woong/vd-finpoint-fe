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
  max: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mb-4">
    <div class="flex items-center gap-2">
      <label :for="id" class="block mb-2 text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <span v-if="required" class="text-red-500">*</span>
    </div>
    <input
      :type="type"
      :id="id"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="
        name === 'birth_date' ||
        name === 'address' ||
        name === 'detail_address' ||
        name === 'annual_salary' ||
        name === 'asset'
          ? false
          : required
      "
      @input="$emit('update:modelValue', $event.target.value)"
      :class="[
        'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black',
        name === 'annual_salary' || name === 'asset' ? 'text-right' : '',
      ]"
      :max="max"
      autocomplete="off"
    />
  </div>
</template>
