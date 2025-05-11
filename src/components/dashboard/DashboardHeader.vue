<script setup lang="ts">
import {ref} from 'vue'
import {onClickOutside, watchDebounced} from '@vueuse/core'
import {Icon} from '@iconify/vue'
import {httpClient} from "@/api";
import {type ActionItem, Avatar, DropdownMenu, Modal} from "@/components/ui";
import SearchItem from "@/components/search/SearchItem.vue";
import {useUsersStore} from "@/stores";
import {ROUTES} from "@/router/routes.ts";
import {useRouter} from "vue-router";

const userStore = useUsersStore();
const router = useRouter();

const searchQuery = ref('')
const searchResults = ref([])
const isLoading = ref(false)
const isOpen = ref(false)

const actions: ActionItem[] = [
  {
    icon: 'heroicons:user-circle',
    key: 'profile',
    label: 'Профиль',
    handler: async () => {
      isOpen.value = false;
      await router.push(ROUTES.USER.PROFILE);
    }
  },
  {
    icon: 'heroicons:arrow-right-end-on-rectangle',
    key: 'logout',
    label: 'Выйти',
    handler: async () => {
      isOpen.value = false;
      await userStore.logout();
    }
  }
];

watchDebounced(
    searchQuery,
    async (newQuery) => {
      if (!newQuery.trim()) {
        searchResults.value = []
        return
      }

      isLoading.value = true
      try {
        searchResults.value = (await httpClient.get<{
          data: any
        }>(`/search?search=${encodeURIComponent(newQuery)}`)).data
      } catch (error) {
        console.error('Ошибка поиска:', error)
        searchResults.value = []
      } finally {
        isLoading.value = false
      }
    },
    {debounce: 300}
)
</script>

<template>
  <header class="bg-white shadow-sm h-16 flex items-center border-b border-gray-200">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <div class="w-64"></div>

        <div class="flex-1 flex justify-end items-center space-x-4">
          <div class="relative max-w-md w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="heroicons:magnifying-glass" class="h-5 w-5 text-gray-500"/>
            </div>
            <input
                placeholder="Искать проект, задачу, команду..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                @click="isOpen = true"
                v-bind:disabled="isOpen"
            />
          </div>

          <div class="relative">
            <div class="flex items-center space-x-2">
              <Avatar :name="userStore.currentUser?.name" size="sm"/>
              <DropdownMenu
                  icon="heroicons:chevron-down"
                  :actions
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <teleport to="body">
    <Modal :is-open="isOpen" @close="isOpen = false">
      <template #title>Поиск</template>
      <template #content>
        <div class="relative">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="heroicons:magnifying-glass" class="h-5 w-5 text-gray-500"/>
          </div>
        </div>
        <div
            class="flex flex-col space-y-1"
            v-if="searchResults.length"
            v-for="result in searchResults"
        >
          <SearchItem :item="result"/>
        </div>
        <div v-else-if="isLoading && !searchResults.length">
          <div class="flex items-center justify-center space-x-2 mt-4">
            <Icon icon="heroicons:sparkles" class="h-5 w-5 text-gray-500"/>
            <span class="text-gray-500 text-sm">Поиск...</span>
          </div>
        </div>
        <div v-else class="flex items-center justify-center space-x-2 mt-4">
          <Icon icon="heroicons:sparkles" class="h-5 w-5 text-gray-500"/>
          <span class="text-gray-500 text-sm">Ничего не найдено</span>
        </div>
      </template>
    </Modal>
  </teleport>
</template>