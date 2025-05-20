<script setup lang="ts">
const { title } = defineProps<{
  title: string,
}>()
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
      <slot name="button" />
    </div>
    <slot />
  </div>
</template>

<style scoped></style>
