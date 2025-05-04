<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <InputField
        id="search"
        v-model="localFilters.search"
        placeholder="Поиск по названию..."
    />
    <SelectField
        v-model="localFilters.status"
        :options="statusOptions"
        placeholder="Статус"
        option-value="value"
        option-label="label"
        class="min-w-40"
    />
    <SelectField
        v-model="localFilters.priority"
        :options="priorityOptions"
        placeholder="Приоритет"
        option-value="value"
        option-label="label"
        clearable
    />
    <SelectField
        v-model="localFilters.tags"
        :options="tagOptions"
        placeholder="Теги"
        option-value="value"
        option-label="label"
        multiple
    />
  </div>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue';
import {IssueStatus, IssuePriority} from '@/api';
import {InputField, SelectField} from "../ui";

const props = defineProps<{
  modelValue: {
    search: string;
    status: IssueStatus | null;
    priority: IssuePriority | null;
    tags: string[];
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void;
}>();

const localFilters = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const statusOptions = Object.values(IssueStatus).map((status) => ({
  value: status,
  label: status.replace('_', ' ').toUpperCase(),
}));

const priorityOptions = Object.values(IssuePriority).map((priority) => ({
  value: priority,
  label: priority.toUpperCase(),
}));

const tagOptions = [
  {value: 'bug', label: 'Bug'},
  {value: 'feature', label: 'Feature'},
  {value: 'enhancement', label: 'Enhancement'},
];

watch(localFilters, (newFilters) => {
  emit('update:modelValue', newFilters);
}, {deep: true});
</script>