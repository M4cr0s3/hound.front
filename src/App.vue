<script setup lang="ts">
import {useUsersStore} from "@/stores";
import {onMounted} from "vue";
import {Toaster} from "vue-sonner";

const usersStore = useUsersStore();

onMounted(async () => {
  if (localStorage.getItem('token')) {
    await usersStore.getCurrentUser();
  }
});
</script>

<template>
  <RouterView/>
  <Toaster rich-colors/>
</template>

<style scoped>

</style>
