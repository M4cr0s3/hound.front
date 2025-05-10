<template>
  <template v-if="to">
    <RouterLink :to="to"
                :class="['inline-flex items-center justify-center rounded-md text-sm font-medium', 'focus:outline-none focus:ring-2 focus:ring-offset-2', variantClasses, customClass]">
      <span v-if="isLoading" class="flex items-center">
        <Icon v-if="loadingIcon" icon="svg-spinners:180-ring" class="animate-spin h-5 w-5 mr-2"/>
        {{ loadingText }}
      </span>
      <span v-else>
        <span class="flex items-center">
           <Icon v-if="icon" :icon="icon" class="mr-2 w-4 h-4"/>
        <slot/>
        </span>
      </span>
    </RouterLink>
  </template>
  <template v-else>
    <button
        :type="type"
        :disabled="disabled || isLoading"
        :class="[
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses,
        customClass,
      ]"
        @click="$emit('click', $event)"
    >
    <span v-if="isLoading" class="flex items-center">
      <Icon v-if="loadingIcon" icon="svg-spinners:180-ring" class="animate-spin h-5 w-5 mr-2"/>
      {{ loadingText }}
    </span>
      <span v-else>
      <span class="flex items-center">
         <Icon v-if="icon" :icon="icon" class="mr-2 w-4 h-4"/>
      <slot/>
      </span>
    </span>
    </button>
  </template>
</template>

<script setup lang="ts">
import {Icon} from '@iconify/vue';
import {computed} from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value: string) => ['button', 'submit', 'reset'].includes(value),
  },
  loadingIcon: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary'].includes(value),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  loadingText: {
    type: String,
    default: 'Загрузка...',
  },
  to: {
    type: String,
    default: '',
  }
});

const emit = defineEmits(['click']);

const variantClasses = computed(() => {
  const classes: Record<string, string> = {
    primary:
        'border border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:ring-indigo-500 py-2 px-4 cursor-pointer',
    secondary:
        'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-indigo-500 py-2 px-4 cursor-pointer',
  };
  return classes[props.variant] || classes.primary;
});
</script>
<style>
button {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}
</style>