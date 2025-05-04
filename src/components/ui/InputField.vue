<template>
  <div>
    <label
        v-if="label"
        :for="id"
        class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <div class="mt-1">
      <input
          :id="id"
          :value="modelValue"
          :type="type"
          :name="name"
          :disabled="disabled"
          :autocomplete="autocomplete"
          :required="required"
          :placeholder="placeholder"
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          :class="{
					'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500':
						error,
					'bg-gray-50 text-gray-500 cursor-not-allowed': disabled,
				  }"
          @input="
					$emit('update:modelValue', ($event.target as HTMLInputElement).value)
				"
      />
    </div>
    <p
        v-if="error"
        class="mt-2 text-sm text-red-600"
    >
      {{ error.toString() }}
    </p>
    <slot name="description"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>
