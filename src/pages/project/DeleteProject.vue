<template>
  <div
      class="p-6"
      v-if="project"
  >
    <div class="w-full">
      <h2 class="text-xl font-semibold text-gray-900">Удаление проекта</h2>
      <div class="mt-4 bg-gray-50 border border-gray-200 rounded-md p-4">
        <div class="flex items-start space-x-3">
          <Icon
              icon="mdi:alert-circle-outline"
              class="h-6 w-6 text-red-500 flex-shrink-0"
          />
          <div>
            <p class="text-sm text-gray-700">
              Удаление проекта
              <span class="font-medium text-gray-900">{{ project.name }}</span>
              — это
              <span class="font-medium text-red-600">необратимое действие</span
              >. Все данные, включая ошибки, события, настройки и интеграции,
              будут удалены навсегда.
            </p>
            <p class="mt-2 text-sm text-gray-600">
              Убедитесь, что вы понимаете последствия, прежде чем продолжить.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <InputField
            id="confirmation"
            v-model="confirmationInput"
            label="Подтвердите удаление"
            :placeholder="`Введите ${project.name} для подтверждения`"
            :required="true"
            class="w-full"
        />
        <p class="mt-1 text-xs text-gray-500">
          Введите точное название проекта, чтобы разблокировать кнопку удаления.
        </p>
      </div>

      <div class="mt-8 flex justify-end">
        <button
            type="button"
            class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 transition-all duration-200 ease-in-out"
            :class="{
						'opacity-50 cursor-not-allowed': !isDeleteEnabled,
						'hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105':
							isDeleteEnabled,
					}"
            :disabled="!isDeleteEnabled"
            @click="handleDelete"
        >
          <Icon
              icon="mdi:trash-can-outline"
              class="h-4 w-4 mr-2"
          />
          Удалить проект
        </button>
      </div>
    </div>
  </div>
  <div
      v-else
      class="p-6 text-gray-500"
  >
    Загрузка проекта...
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useProjectsStore} from '@/stores';
import {useRouter} from 'vue-router';
import {InputField} from '@/components/ui';
import {Icon} from '@iconify/vue';
import {ROUTES} from '@/router/routes.ts';

const {project} = defineProps<{
  project: {
    name: string;
    slug: string;
  };
}>();

const store = useProjectsStore();
const router = useRouter();

const confirmationInput = ref('');
const isDeleteEnabled = computed(
    () => confirmationInput.value === project.name
);

const handleDelete = async () => {
  if (!isDeleteEnabled.value) return;

  try {
    await store.destroy(project.slug);
    await router.push({path: ROUTES.PROJECT.INDEX});
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
  }
};
</script>

<style scoped>
button {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
