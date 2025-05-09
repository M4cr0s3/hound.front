<template>
  <div>
    <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <h3 class="text-lg font-semibold text-gray-900">
        Основные настройки
      </h3>
    </div>

    <div class="px-6 py-5 space-y-6">
      <InputField
          id="project-name"
          label="Название проекта"
          v-model="store.updateBody.name"
      >
        <template #description>
          <p class="mt-2 text-sm text-gray-500">
            Изменение названия проекта будет обновлять слаг проекта.
          </p>
        </template>
      </InputField>

      <InputField
          id="project-slug"
          label="Slug проекта"
          v-model="store.updateBody.slug"
          :disabled="true"
      >
        <template #description>
          <p class="mt-2 text-sm text-gray-500">
            Используется в ссылках и API эндпоинтах.
          </p>
        </template>
      </InputField>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Платформа</label>
        <div class="my-2 flex items-center">
          <Icon
              :icon="PLATFORMS.find((p) => p.name === project.platform)?.icon as string"
              class="h-6 w-6 mr-2 text-gray-600"
          />
          <span class="text-sm text-gray-700">{{ project.platform }}</span>
        </div>
        <p class="mt-2 text-sm text-gray-500">
          Платформу нельзя изменить после создания проекта.
        </p>
      </div>

      <div class="space-y-4" v-if="key">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Публичный ключ</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <InputField
                type="text"
                v-model="key.public_key"
                readonly
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50"
                id="public-key"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                  @click="copyToClipboard(key.public_key)"
                  class="text-gray-400 hover:text-gray-500 cursor-pointer"
                  title="Копировать"
              >
                <Icon icon="heroicons:clipboard" class="h-5 w-5"/>
              </button>
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Используется для идентификации проекта в клиентских приложениях.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Приватный ключ</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <InputField
                :type="showPrivateKey ? 'text' : 'password'"
                v-model="key.private_key"
                readonly
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50"
                ref="privateKeyInput"
                id="private-key"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
              <button
                  @click="togglePrivateKeyVisibility"
                  class="text-gray-400 hover:text-gray-500"
                  :title="showPrivateKey ? 'Скрыть' : 'Показать'"
              >
                <Icon :icon="showPrivateKey ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5"/>
              </button>
              <button
                  @click="copyToClipboard(key.private_key)"
                  class="text-gray-400 hover:text-gray-500 cursor-pointer"
                  title="Копировать"
              >
                <Icon icon="heroicons:clipboard" class="h-5 w-5"/>
              </button>
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Держите в секрете, используется для аутентификации на сервере.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">DSN (Data Source Name)</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <InputField
                id="dsn"
                type="text"
                v-model="key.dsn"
                readonly
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                  @click="copyToClipboard(key.dsn)"
                  class="text-gray-400 hover:text-gray-500 cursor-pointer"
                  title="Копировать"
              >
                <Icon icon="heroicons:clipboard" class="h-5 w-5"/>
              </button>
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Используйте эту строку для подключения к сервису.
          </p>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200 flex justify-end">
        <SubmitButton
            class="cursor-pointer"
            @click.prevent="store.update(project.slug, store.updateBody)"
        >
          Сохранить изменения
        </SubmitButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import InputField from '@/components/ui/InputField.vue';
import {Icon} from '@iconify/vue';
import {watch} from 'vue';
import SubmitButton from '@/components/ui/SubmitButton.vue';
import {useProjectsStore} from '@/stores';
import {useRoute} from 'vue-router';
import {PLATFORMS} from '@/data';
import type {Project} from "@/api";
import {toast} from "vue-sonner";

const props = defineProps<{
  project: Project
}>();

const key = computed(() => props.project.key)
const route = useRoute();
const store = useProjectsStore();
const showPrivateKey = ref(false);
const privateKeyInput = ref<HTMLInputElement | null>(null);

const togglePrivateKeyVisibility = () => {
  showPrivateKey.value = !showPrivateKey.value;
  if (privateKeyInput.value) {
    privateKeyInput.value.type = showPrivateKey.value ? 'text' : 'password';
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success('Скопировано в буфер обмена');
};

watch(
    () => route.params.slug,
    () => {
      store.fetchProject(route.params.slug as string);
    }
);
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: scale(1.1);
}
</style>