<script setup lang="ts">
import {useUsersStore} from "@/stores";
import {onMounted} from "vue";

const usersStore = useUsersStore();

onMounted(async () => {
  await usersStore.getCurrentUser();
});
</script>

<template>
  <RouterView/>
</template>

<style scoped>

</style>
