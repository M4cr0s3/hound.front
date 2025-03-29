<template>
  <div>
    <div class="px-6 py-5">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Основные настройки</h3>
    </div>

    <div class="px-6 py-5 space-y-6">
      <InputField
          id="project-name"
          label="Название проекта"
          v-model="store.updateBody.name"
      >
        <template #description>
          <p class="mt-2 text-sm text-gray-500">Изменение названия проекта будет обновлять слаг проекта.</p>
        </template>
      </InputField>

      <InputField
          id="project-slug"
          label="Slug проекта"
          v-model="store.updateBody.slug"
          :disabled="true"
      >
        <template #description>
          <p class="mt-2 text-sm text-gray-500">Используется в ссылках и API эндпоинтах.</p>
        </template>
      </InputField>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Платформа</label>
        <div class="my-2 flex items-center">
          <Icon :icon="PLATFORMS.find(p => p.name === project.platform)?.icon" class="h-6 w-6 mr-2"/>
          <span class="text-sm text-gray-700">{{ project.platform }}</span>
        </div>
        <p class="mt-2 text-sm text-gray-500">
          Платформу нельзя изменить после создания проекта.
        </p>
      </div>

      <div class="flex justify-end">
        <SubmitButton class="cursor-pointer" @click.prevent="store.update(project.slug, store.updateBody)">
          Сохранить
        </SubmitButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputField from '../components/ui/InputField.vue';
import {Icon} from '@iconify/vue';
import {watch} from 'vue';
import SubmitButton from "../components/ui/SubmitButton.vue";
import {useProjectsStore} from "../stores";
import {useRoute} from "vue-router";
import {PLATFORMS} from "../data";

defineProps({
  project: {
    type: Object,
    required: true
  }
});

const route = useRoute();

watch(() => route.params.slug, () => {
  store.fetchProject(route.params.slug);
})

const store = useProjectsStore();
</script>