<script setup lang="ts">
import { Button } from "@/components/ui";
import { ROUTES } from "@/router/routes.ts";
import { useUsersStore } from "@/stores";
import { useRouter } from "vue-router";

const router = useRouter();
const usersStore = useUsersStore();

</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col items-center space-y-3">
      <h1 class="text-3xl font-bold text-gray-700">
         Извините, страница не найдена
      </h1>
      <h2 class="text-xl text-gray-600">
        Такая страница не сущестует, либо была удалена
      </h2>
      <div class="flex justify-center gap-4 mt-2">
        <Button v-if="usersStore.currentUser?.name" @click="router.push(ROUTES.DASHBOARD)">
        Главная
      </Button>
      <Button v-else @click="router.push(ROUTES.LOGIN)">
        Авторизация
      </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>