<template>
  <div class="bg-gray-50 rounded-md p-4">
    <pre class="text-sm overflow-x-auto">{{ formattedJson }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any;
}>();

const formattedJson = computed(() => {
  return JSON.stringify(props.data, null, 2);
});
</script>