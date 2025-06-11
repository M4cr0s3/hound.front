<template>
  <SelectField
      :options="options"
      option-label="label"
      option-value="value"
      :modelValue="modelValue"
      placeholder="Выберите приоритет"
      @update:modelValue="handleValueChange"
  />
</template>

<script setup lang="ts">
import { SelectField } from "@/components/ui";

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const options = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

const handleValueChange = (value: string) => {
  emit('update:modelValue', value);
  emit('change', value);
};
</script>