<template>
  <div class="px-6 py-12 text-center">
    <Icon :icon="icon" :height="iconHeight" :width="iconWidth" class="mx-auto h-12 w-12 text-gray-400"></Icon>
    <h3 class="mt-2 text-sm font-medium text-gray-900">
      {{ title }}
    </h3>
    <p class="mt-1 text-sm text-gray-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {Icon} from '@iconify/vue';

defineProps<{
  icon: string
  title: string
  description: string
  iconHeight?: number
  iconWidth?: number
}>()
</script>