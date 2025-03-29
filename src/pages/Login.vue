<template>
  <AuthLayout>
    <div class="sm:mx-auto flex items-center flex-col sm:w-full sm:max-w-md">
      <Logo width="128" height="128"/>
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
            autocomplete="email"
            required
            :error="errors.fieldErrors.email"
        />

        <InputField
            id="password"
            v-model="credentials.password"
            label="Пароль"
            type="password"
            autocomplete="current-password"
            required
            :error="errors.fieldErrors.password"
        />

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
              Забыли пароль?
            </a>
          </div>
        </div>

        <CommonError v-if="errors.commonError" :message="errors.commonError"/>

        <SubmitButton :loading="isLoading">
          Войти
        </SubmitButton>
      </AuthForm>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import Logo from "../components/ui/Logo.vue";
import InputField from "../components/ui/InputField.vue";
import AuthForm from "../components/auth/AuthForm.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import {useLogin} from "../composables";
import SubmitButton from "../components/ui/SubmitButton.vue";
import CommonError from "../components/ui/CommonError.vue";

const {credentials, errors, isLoading, handleSubmit} = useLogin();
</script>