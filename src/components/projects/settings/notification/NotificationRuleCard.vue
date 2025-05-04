<script setup lang="ts">
import {type Id, type NotificationRule} from '../../../../api';
import {Icon} from '@iconify/vue';
import {computed} from 'vue';

const props = defineProps<{
  rule: NotificationRule;
}>();

const emit = defineEmits(['updated', 'deleted']);

const eventTypeClasses = computed(() => {
  const classes: Record<string, string> = {
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };
  return classes[props.rule.event_type] || 'bg-gray-100 text-gray-800';
});

const triggerTypeLabel = computed(() => {
  const labels: Record<string, string> = {
    count: 'Количество',
    rate_limit: 'Превышение лимита',
  };
  return labels[props.rule.trigger_type] || props.rule.trigger_type;
});

const handleEdit = () => {
  // Implement edit logic
  emit('updated');
};

const handleDelete = (id: Id) => {
  // Implement delete logic
  emit('deleted', id);
};
</script>

<template>
  <li class="px-6 py-4 hover:bg-gray-50 transition-colors">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="eventTypeClasses"
        >
          {{ rule.event_type }}
        </span>

        <div class="text-sm text-gray-900">
          <span class="font-medium">{{ triggerTypeLabel }}</span>
          <template v-if="rule.trigger_type === 'rate_limit'">
            <span class="text-gray-500 mx-1">•</span>
            <span class="text-gray-500">Когда более {{ rule.trigger_params.threshold }} событий за {{ rule.trigger_params.time_window }} минут</span>
          </template>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <span
            v-for="channel in rule.channels"
            :key="channel"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          {{ channel }}
        </span>

        <button
            @click="handleEdit"
            class="p-1 text-gray-400 hover:text-gray-500"
            aria-label="Edit rule"
        >
          <Icon icon="heroicons-outline:pencil" class="h-4 w-4 cursor-pointer"/>
        </button>

        <button
            @click="handleDelete(rule.id)"
            class="p-1 text-gray-400 hover:text-red-500"
            aria-label="Delete rule"
        >
          <Icon icon="heroicons-outline:trash" class="h-4 w-4 cursor-pointer"/>
        </button>
      </div>
    </div>

    <div class="mt-2 text-xs text-gray-500">
      Последнее обновление {{ new Date(rule.updated_at).toLocaleString() }}
    </div>
  </li>
</template>