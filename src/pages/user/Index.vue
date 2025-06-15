<script setup lang="ts">
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {EmptyState} from "@/components/projects/settings/notification";
import {Icon} from "@iconify/vue";
import {useUsersStore} from "@/stores";
import {onMounted} from "vue";
import {UsersTable} from "@/components/user";
import {RoleTitle} from "@/api";

const usersStore = useUsersStore();

const handlePageChange = (page: string) => {
  usersStore.filters.page = Number(page);
  usersStore.fetchUsers();
};

onMounted(async () => {
  await usersStore.fetchUsers();
})
</script>

<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Пользователи</h1>
        <RouterLink
            v-if="usersStore.currentUser.role?.title === RoleTitle.Maintainer"
            to="/users/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Icon
              icon="heroicons:plus"
              class="-ml-1 mr-2 h-5 w-5"
          />
          Добавить пользователя
        </RouterLink>
      </div>

      <div class="bg-white shadow rounded-lg">
        <ul
            v-if="usersStore.isLoading"
            class="divide-y divide-gray-200"
        >
          <li
              v-for="i in 5"
              :key="`skeleton-${i}`"
              class="px-4 py-4 sm:px-6"
          >
            <div class="flex items-center space-x-4 animate-pulse">
              <div class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200"></div>
              <div class="flex-1 min-w-0 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </li>
        </ul>

        <EmptyState
            v-else-if="!usersStore.users.length && !usersStore.isLoading"
            title="Пользователи не найдены"
            icon="heroicons:users"
            description="Добавьте пользователей, чтобы увидеть их здесь."
        />

        <UsersTable
            v-else
            :users="usersStore.users"
            :pagination="usersStore.pagination"
            :is-loading="usersStore.isLoading"
            @pageChange="handlePageChange"
        />

      </div>
    </div>

  </DashboardLayout>
</template>

<style scoped>

</style>