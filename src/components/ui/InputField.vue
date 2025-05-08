<template>
  <div>
    <label
        v-if="label"
        :for="id"
        class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative mt-1 rounded-md shadow-sm">
      <div
          v-if="$slots.icon || icon"
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <slot name="icon">
          <Icon v-if="icon" :icon="icon" class="h-5 w-5 text-gray-400" />
        </slot>
      </div>
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
            'border-red-400 text-red-900 placeholder-red-500 focus:border-red-500 focus:outline-none focus:ring-red-500': error,
            'border-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500': !error,
            'bg-gray-50 text-gray-500 cursor-not-allowed': disabled,
            'pl-10': $slots.icon || icon,
            'px-3 py-2': size === 'md',
            'px-2 py-1 text-sm': size === 'sm',
          }"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <div
          v-if="$slots.rightIcon || rightIcon"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <slot name="rightIcon">
          <Icon v-if="rightIcon" :icon="rightIcon" class="h-5 w-5 text-gray-400" />
        </slot>
      </div>
    </div>
    <p
        v-if="error"
        class="mt-1 text-sm text-red-600"
    >
      {{ error.toString() }}
    </p>
    <p
        v-if="description"
        class="mt-1 text-sm text-gray-500"
    >
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

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
  description: {
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
    type: [String, Array],
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  rightIcon: {
    type: String,
    default: ''
  },
  size: {
    type: String as () => 'sm' | 'md',
    default: 'md'
  }
});

defineEmits(['update:modelValue']);
</script>