<script setup lang="ts">
import {Icon} from '@iconify/vue';

defineProps<{
  item: any
}>()

const buildUrl = (item: any) => {
  if (item.type === 'issue') {
    return `/issues/${item.id}`
  }

  if (item.type === 'project') {
    return `/projects/${item.slug}/settings`
  }

  if (item.type === 'event') {
    return `/projects/${item.project.slug}/events/${item.slug}`
  }
}
</script>

<template>
  <RouterLink
      class="flex items-center justify-between cursor-pointer space-x-2 border border-gray-200 rounded-md p-3 shadow-xs mt-2"
      :to="buildUrl(item)"
  >
    <div class="flex items-center gap-4">
      <span v-if="item.type === 'issue'">
        <Icon icon="heroicons:document-text" class="h-5 w-5 text-gray-500"/>
      </span>
      <span v-if="item.type === 'project'">
        <Icon icon="heroicons:folder" class="h-5 w-5 text-gray-500"/>
      </span>
      <span v-if="item.type === 'event'">
        <Icon icon="heroicons:calendar" class="h-5 w-5 text-gray-500"/>
      </span>
      <span v-if="item.type === 'team'">
        <Icon icon="heroicons:users" class="h-5 w-5 text-gray-500"/>
      </span>
      <span class="text-sm text-gray-700 font-medium">
        {{ item?.title ?? item.name }}
      </span>
    </div>
    <span class="text-sm text-gray-500">
        <Icon icon="heroicons:chevron-right" class="h-5 w-5"/>
    </span>
  </RouterLink>
</template>

<style scoped>

</style>