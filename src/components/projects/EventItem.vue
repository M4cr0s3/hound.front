<template>
  <div class="px-5 py-4 hover:bg-gray-50 transition-colors duration-150">
    <div class="flex items-start space-x-3">
      <div
          class="flex-shrink-0 mt-1"
          :class="{
          'text-red-500': event.level === 'error' || event.level === 'critical',
          'text-amber-500': event.level === 'warning',
          'text-gray-500': event.level === 'info'
        }"
      >
        <Icon
            :icon="{
            critical: 'heroicons:exclamation-triangle',
            error: 'heroicons:exclamation-circle',
            warning: 'heroicons:exclamation-circle',
            info: 'heroicons:information-circle'
          }[event.level]"
            class="h-5 w-5"
        />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-gray-900 truncate">
          {{ event.message }}
        </p>
        <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span class="text-xs text-gray-500">
            {{ formatDateTime(event.created_at) }}
          </span>
          <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="{
              'bg-red-100 text-red-800': event.level === 'error' || event.level === 'critical',
              'bg-amber-100 text-amber-800': event.level === 'warning',
              'bg-blue-100 text-blue-800': event.level === 'info'
            }"
          >
            {{ event.level }}
          </span>
        </div>
      </div>
      <RouterLink
          :to="`/projects/${projectSlug}/events/${event.id}`"
          class="text-gray-400 hover:text-gray-500"
      >
        <Icon icon="heroicons:chevron-right" class="h-5 w-5"/>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Icon} from '@iconify/vue';
import {formatDateTime} from '@/utils';
import type {Event} from '@/api'

defineProps<{
  event: Event;
  projectSlug: string;
}>();
</script>