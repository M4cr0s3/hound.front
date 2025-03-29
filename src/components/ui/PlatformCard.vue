<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <button
          v-for="platform in filteredPlatforms"
          :key="platform.id"
          @click="selectPlatform(platform)"
          class="p-3 border rounded-lg flex flex-col items-center transition-colors"
          :class="{
          'border-indigo-500 bg-indigo-50': selectedPlatform?.id === platform.id,
          'border-gray-200 hover:border-gray-300': selectedPlatform?.id !== platform.id
        }"
      >
        <Icon :icon="platform.icon" class="w-8 h-8 mb-2"/>
        <span class="text-sm text-center">{{ platform.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref, computed } from 'vue';
import  {type Platform, PLATFORMS} from "../../data";

const props = defineProps<{
  category?: string; // 'frontend', 'backend' и т.д.
}>();

const selectedPlatform = ref<Platform | null>(null);

const filteredPlatforms = computed(() => {
  return props.category
      ? PLATFORMS.filter(p => p.categories.includes(props.category))
      : PLATFORMS;
});

const selectPlatform = (platform: Platform) => {
  selectedPlatform.value = platform;
};

defineExpose({
  selectedPlatform
});
</script>