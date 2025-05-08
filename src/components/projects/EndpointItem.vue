<template>
  <div class="px-5 py-4 hover:bg-gray-50 transition-colors duration-150">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3 min-w-0">
        <div
            class="flex-shrink-0"
            :class="{
            'text-green-500': endpoint.is_active,
            'text-red-500': !endpoint.is_active
          }"
        >
          <Icon
              :icon="endpoint.is_active ? 'heroicons:check-circle' : 'heroicons:x-circle'"
              class="h-5 w-5"
          />
        </div>
        <div class="min-w-0">
          <RouterLink
              :to="`/healthcheck/${endpoint.id}/results`"
              class="text-sm font-medium text-gray-900 truncate">
            {{ endpoint.url }}
          </RouterLink>
          <div class="mt-1 flex items-center space-x-3">
            <span class="text-xs text-gray-500">
              HTTP {{ endpoint.expected_status }}
            </span>
            <span class="text-xs text-gray-500">
              Каждые {{ endpoint.interval }} мин
            </span>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button
            @click.stop="$emit('delete', endpoint.id)"
            class="text-gray-400 hover:text-red-500"
        >
          <Icon icon="heroicons:trash" class="h-4 w-4 cursor-pointer"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Icon} from '@iconify/vue';
import type {HealthCheckEndpoint} from "@/stores";

defineProps<{
  endpoint: HealthCheckEndpoint;
}>();

defineEmits(['delete']);
</script>