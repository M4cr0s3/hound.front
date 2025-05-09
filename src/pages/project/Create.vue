<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center space-x-4 mb-8">
        <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
          <Icon icon="heroicons:plus-circle" class="h-8 w-8 text-white"/>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Создание нового проекта</h1>
          <p class="text-sm text-gray-500">Заполните информацию о проекте, чтобы начать работу</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 class="text-lg font-semibold text-gray-900">Основные параметры</h2>
        </div>

        <form
            class="p-6 space-y-6"
            @submit.prevent="handleSubmit"
        >
          <InputField
              id="project-name"
              label="Название проекта"
              v-model="form.name"
              placeholder="project"
              required
              icon="heroicons:tag"
          />

          <InputField
              id="project-slug"
              label="URL-идентификатор"
              v-model="form.slug"
              placeholder="Например: new-project"
              description="Уникальный идентификатор проекта в URL. Можно оставить пустым для автоматической генерации."
              icon="heroicons:link"
          />

          <SelectField
              v-model="form.team_id"
              :options="teamsStore.teams"
              label="Команда"
              placeholder="Выберите команду"
              option-label="name"
              option-value="id"
              no-options-value="Команды отсутствуют"
              icon="heroicons:user-group"
              required
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Платформа
              <span class="text-red-500">*</span>
            </label>
            <PlatformCard v-model="form.platform"/>
          </div>

          <div class="pt-4 flex justify-end gap-x-3 border-t border-gray-100">
            <Button
                variant="secondary"
                @click="$router.push(ROUTES.PROJECT.INDEX)"
                class="px-4 py-2"
            >
              <Icon icon="heroicons:x-mark" class="mr-2 h-4 w-4"/>
              Отмена
            </Button>
            <Button
                type="submit"
                :is-loading="projectsStore.isLoading"
                :loading-text="'Создание...'"
                class="px-4 py-2"
            >
              <Icon icon="heroicons:plus" class="mr-2 h-4 w-4"/>
              Создать проект
            </Button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import PlatformCard from '@/components/projects/PlatformCard.vue';
import {InputField, SelectField, Button} from '@/components/ui'
import {ref} from 'vue';
import {ROUTES} from '@/router/routes.ts';
import type {CreateProjectBody} from '@/api';
import {useProjectsStore, useTeamsStore} from '@/stores';
import {Icon} from '@iconify/vue';
import {toast} from "vue-sonner";

const form = ref<CreateProjectBody>({
  name: '',
  slug: '',
  team_id: 0,
  platform: '',
});

const handleSubmit = async () => {
  try {
    await projectsStore.create(form.value);
    toast.success('Проект успешно создан');
  } catch (e) {
    toast.error('Произошла ошибка при создании проекта', {
      description: e.data.message
    });
  }
};

const projectsStore = useProjectsStore();
const teamsStore = useTeamsStore();
</script>