<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center space-x-4 mb-8">
        <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
          <Icon icon="heroicons:user-group" class="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Создание новой команды</h1>
          <p class="text-sm text-gray-500">Объедините участников для совместной работы над проектами</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 class="text-lg font-semibold text-gray-900">Основные параметры</h2>
        </div>

        <form
            @submit.prevent="handleSubmit"
            class="p-6 space-y-6"
        >
          <InputField
              id="team-name"
              v-model="form.name"
              label="Название команды"
              placeholder="Например: Backend разработка"
              required
              :error="errors.name"
              icon="heroicons:tag"
          />

          <InputField
              id="team-slug"
              v-model="form.slug"
              label="URL-идентификатор"
              placeholder="Например: backend-team"
              :error="errors.slug"
              description="Если не указан, будет сгенерирован автоматически"
              icon="heroicons:link"
          />

          <div class="pt-4 flex justify-end gap-x-3 border-t border-gray-100">
            <Button
                variant="secondary"
                @click="$router.push(ROUTES.TEAM.INDEX)"
                class="px-4 py-2"
            >
              <Icon icon="heroicons:x-mark" class="mr-2 h-4 w-4" />
              Отмена
            </Button>
            <Button
                type="submit"
                :is-loading="isSubmitting"
                :loading-text="'Создание...'"
                :disabled="isSubmitting"
                class="px-4 py-2"
            >
              <Icon icon="heroicons:plus" class="mr-2 h-4 w-4" />
              Создать команду
            </Button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useTeam } from '@/composables';
import { InputField, Button } from '@/components/ui';
import { ROUTES } from '@/router/routes.ts';
import { useTeamsStore } from '@/stores';
import { Icon } from '@iconify/vue';

const teamsStore = useTeamsStore();
const { form, errors, isSubmitting } = useTeam();

const handleSubmit = async () => {
  await teamsStore.create(form);
};
</script>

<style scoped>
form {
  transition: all 0.3s ease;
}

button {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}
</style>