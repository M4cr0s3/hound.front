<template>
  <div class="flex flex-wrap gap-2">
    <span
        v-for="(value, key) in tags"
        :key="key"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
    >
      {{ key }}: {{ value }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: Record<string, string>;
}>();
</script>