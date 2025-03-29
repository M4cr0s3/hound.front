<template>
  <div class="flex items-start">
    <div class="flex items-center h-5">
      <input
          :id="name"
          :value="modelValue"
          type="checkbox"
          class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
      >
    </div>
    <div class="ml-3 text-sm">
      <label :for="name" class="font-medium text-gray-700">{{ label }}</label>
      <p v-if="description" class="text-gray-500">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>