<template>
  <AuthLayout>
    <div class="sm:mx-auto flex items-center flex-col sm:w-full sm:max-w-md">
      <Logo :width="128" :height="128"/>
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Задайте пароль для вашего аккаунта
      </h2>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <TheForm
            class="space-y-6"
            :schema
            :data="credentials"
            :submit="handleSubmit"
            v-slot="{ errors }"
        >
          <InputField
              id="email"
              v-model="credentials.email"
              label="Электронная почта"
              type="email"
              disabled
              autocomplete="email"
              :error="errors?.email"
              required
          />

          <InputField
              id="password"
              v-model="credentials.password"
              label="Пароль"
              type="password"
              autocomplete="current-password"
              :error="errors?.password"
              required
          />

          <InputField
              id="password-confirm"
              v-model="credentials.password_confirmation"
              label="Подтверждение пароля"
              type="password"
              autocomplete="current-password"
              :error="errors?.password_confirmation"
              required
          />

          <Button type="submit" class="w-full">Войти</Button>
        </TheForm>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { httpClient, type BaseResponse, type Invitation } from "@/api";
import { Button, InputField, Logo, TheForm } from '@/components/ui';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { ROUTES } from "@/router/routes.ts";
import { FetchError } from "ofetch";
import * as v from 'valibot';
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

const route = useRoute();
const router = useRouter();

const credentials = reactive({
  email: '',
  password: '',
  password_confirmation: '',
});

const schema = v.pipe(v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8, 'Пароль должен быть не менее 8 символов')),
  password_confirmation: v.string(),
}), v.forward(
    v.partialCheck(
        [['password'], ['password_confirmation']],
        (input) => input.password === input.password_confirmation,
        'Пароли не совпадают'
    ),
    ['password_confirmation']
));

async function fetchInvitationInfo(token: string) {
  try {
    const res = await httpClient.get<{ invite: Invitation }>('/invites/' + token);
    credentials.email = res.invite.user.email;
  } catch (e) {
    if (e instanceof FetchError && e.status === 409) {
      await router.push(ROUTES.LOGIN);
    }
    else {
      throw e
    }
  }
}

async function handleSubmit(data: any) {
  try {
    const res = await httpClient.post<BaseResponse>(`/invites/${route.params.token}/activate`, data);
    if (res.success) {
      toast.success('Вы успешно зарегистрировались');
      await router.push(ROUTES.LOGIN);
    }
  } catch (e) {
    console.error('Submission error:', e);
  }
}

onMounted(async () => {
  await fetchInvitationInfo(route.params.token as string);
});

</script>