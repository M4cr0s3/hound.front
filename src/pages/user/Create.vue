<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Создание нового пользователя
          </h3>
        </div>

        <form
            @submit.prevent="usersStore.createUser(form)"
            class="px-4 py-5 sm:p-6"
        >
          <div class="space-y-6">
            <InputField
                id="email"
                v-model="form.email"
                label="Почта"
                type="text"
                placeholder="ivanov@mail.ru"
                required
                :error="usersStore.getError('email')"
            />

            <InputField
                id="name"
                v-model="form.name"
                label="Имя пользователя"
                type="text"
                placeholder="Иван"
                :error="usersStore.getError('name')"
            />

            <SelectField
                :options="[{label: 'Maintainer', value: 1}, {label: 'Developer', value: 2}]"
                v-model="form.role_id"
                label="Роль"
                placeholder="Выберите роль"
                option-label="label"
                option-value="value"
                :error="usersStore.getError('role_id')"
            />

            <div class="flex justify-end space-x-3">
              <Button
                  variant="secondary"
                  @click="$router.push(ROUTES.USER.INDEX)"
              >
                Отмена
              </Button>
              <Button
                  type="submit"
                  :is-loading="usersStore.isLoading"
              >
                <span v-if="!usersStore.isLoading">Создать пользователя</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import {Button, InputField, SelectField} from '@/components/ui';
import {useUsersStore} from '@/stores';
import {ROUTES} from "@/router/routes.ts";
import {reactive} from "vue";

const usersStore = useUsersStore();

const form = reactive({
  email: '',
  name: '',
  role_id: 0,
});
</script>
