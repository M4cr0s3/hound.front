<script setup lang="ts">
defineProps<{
  name?: string
  src?: string
  size: string
}>()

function getSize(size: string) {
  switch (size) {
    case 'xs':
      return 'w-5 h-5'
    case 'sm':
      return 'w-8 h-8'
    case 'md':
      return 'w-10 h-10'
    case 'lg':
      return 'w-12 h-12'
    case 'xl':
      return 'w-16 h-16'
    case '2xl':
      return 'w-20 h-20'
    case '3xl':
      return 'w-24 h-24'
    case '4xl':
      return 'w-32 h-32'
    case '5xl':
      return 'w-40 h-40'
    default:
      return 'w-10 h-10'
  }
}
</script>

<template>
  <template v-if="src">
    <img class="rounded-full" :class="getSize(size)" :src="src" :alt="name"/>
  </template>
  <template v-else>
    <span class="inline-flex items-center justify-center rounded-full bg-gray-100 text-indigo-600 font-bold" :class="getSize(size)">
      {{ name?.charAt(0) }}
    </span>
  </template>
</template>

<style scoped>

</style>