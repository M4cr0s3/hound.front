<template>
  <AuthLayout>
    <div class="sm:mx-auto flex items-center flex-col sm:w-full sm:max-w-md">
      <Logo
          :width="128"
          :height="128"
      />
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Войдите в свой аккаунт
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <AuthForm @submit="handleSubmit">
        <InputField
            id="email"
            v-model="credentials.email"
            label="Электронная почта"
            type="email"
            icon="heroicons:envelope"
            placeholder="dev@dev.ru"
            autocomplete="email"
            required
        />

        <InputField
            id="password"
            v-model="credentials.password"
            label="Пароль"
            type="password"
            icon="heroicons:lock-closed"
            placeholder="••••••••"
            autocomplete="current-password"
            required
        />

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <a
                href="#"
                class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Забыли пароль?
            </a>
          </div>
        </div>
        <SubmitButton :loading="isLoading"> Войти</SubmitButton>
      </AuthForm>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import {InputField, SubmitButton, Logo} from '@/components/ui';
import AuthForm from '@/components/auth/AuthForm.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import {useLogin} from '@/composables';

const {credentials, isLoading, handleSubmit} = useLogin();
</script>
