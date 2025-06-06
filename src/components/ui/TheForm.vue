<template>
  <form @submit.prevent="handleSubmit">
    <slot :errors="errors"></slot>
  </form>
</template>

<script setup lang="ts" generic="T">
import type { BaseSchema } from 'valibot';
import * as v from 'valibot';
import { ref } from 'vue';

const props = defineProps<{
  schema: BaseSchema<any, any,  v.BaseIssue<unknown>>,
  submit: (data: any) => Promise<unknown> | unknown
  data: T
}>();

type Error = Record<keyof T, string>

const emit = defineEmits(['submit']);
const errors = ref<Error>();

async function handleSubmit() {
  try {
    errors.value = {} as Error;
    const result = await v.parse(props.schema, props.data);
    await props.submit(result);
    emit('submit', result);
  } catch (e) {
    if (e instanceof v.ValiError) {
      errors.value = transformValiError(e);
    }
    throw e;
  }
}

function transformValiError(error: v.ValiError<typeof props.schema>): Error {
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