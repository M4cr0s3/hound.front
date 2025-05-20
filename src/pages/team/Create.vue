<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center space-x-4 mb-8">
        <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
          <Icon icon="heroicons:user-group" class="h-8 w-8 text-white"/>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Создание новой команды</h1>
          <p class="text-sm text-gray-500">Объедините участников для совместной работы над проектами</p>
        </div>
      </div>
      <ThePanel title="Основные параметры">
        <TheForm
            :submit="handleSubmit"
            class="p-6 space-y-6"
            :data="form"
            v-slot="{ errors }"
            :schema
        >
          <InputField
              id="team-name"
              v-model="form.name"
              label="Название команды"
              placeholder="Например: Backend разработка"
              required
              :error="errors?.name"
              icon="heroicons:tag"
          />

          <InputField
              id="team-slug"
              v-model="form.slug"
              label="URL-идентификатор"
              placeholder="Например: backend-team"
              :error="errors?.slug"
              description="Если не указан, будет сгенерирован автоматически"
              icon="heroicons:link"
          />

          <div class="pt-4 flex justify-end gap-x-3 border-t border-gray-100">
            <Button
                variant="secondary"
                @click="$router.push(ROUTES.TEAM.INDEX)"
                class="px-4 py-2"
            >
              <Icon icon="heroicons:x-mark" class="mr-2 h-4 w-4"/>
              Отмена
            </Button>
            <Button
                type="submit"
                :is-loading="isSubmitting"
                :loading-text="'Создание...'"
                class="px-4 py-2"
            >
              <Icon icon="heroicons:plus" class="mr-2 h-4 w-4"/>
              Создать команду
            </Button>
          </div>
        </TheForm>
      </ThePanel>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { Button, InputField, TheForm } from '@/components/ui';
import ThePanel from '@/components/ui/ThePanel.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { ROUTES } from '@/router/routes.ts';
import { useTeamsStore } from '@/stores';
import { Icon } from '@iconify/vue';
import * as v from 'valibot';
import { reactive, ref } from "vue";
import { toast } from "vue-sonner";

const teamsStore = useTeamsStore();
const form = reactive({
  name: '',
  slug: ''
});
const isSubmitting = ref(false);

const schema = v.object({
  name: v.string(),
  slug: v.optional(v.string()),
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    await teamsStore.create(form);
    toast.success('Команда успешно создана');
  } finally {
    isSubmitting.value = false;
  }
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