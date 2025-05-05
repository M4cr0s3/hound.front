<script setup lang="ts">
import {Button} from "@/components/ui";
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes.ts";
import {useUsersStore} from "@/stores";
import {computed} from "vue";

const router = useRouter();
const usersStore = useUsersStore();

const text = computed(() => {
  return usersStore.currentUser?.name ? 'панели' : 'входа';
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col items-center space-y-3">
      <h1 class="text-3xl font-bold text-gray-700">
        Перейти на страницу {{ text }}
      </h1>
      <Button @click="router.push(text === 'панели' ? ROUTES.DASHBOARD : ROUTES.LOGIN)">
        На страницу {{ text }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>