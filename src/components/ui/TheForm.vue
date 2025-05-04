<template>
  <form @submit.prevent="handleSubmit">
    <slot :errors="errors"></slot>
  </form>
</template>

<script setup lang="ts" generic="T">
import {ref} from 'vue';
import * as v from 'valibot';
import type {BaseSchema} from 'valibot';

const props = defineProps<{
  schema: BaseSchema,
  submit?: (data: any) => Promise<void> | void
  data: T
}>();

const emit = defineEmits(['submit']);
const errors = ref<Record<keyof T, string>>({});

async function handleSubmit() {
  try {
    errors.value = {};
    const result = await v.parse(props.schema, props.data);
    await props.submit(result);
    emit('submit', result);
  } catch (e) {
    if (e instanceof v.ValiError) {
      errors.value = transformValiError(e);
    } else {
      throw e;
    }
  }
}

function transformValiError(error: v.ValiError): Record<string, string> {
  const result: Record<string, string> = {};
  error.issues.forEach(issue => {
    if (issue.path) {
      const key = issue.path.map(p => p.key).join('.');
      result[key] = issue.message;
    }
  });
  return result;
}
</script>