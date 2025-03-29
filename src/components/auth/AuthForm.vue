<script setup lang="ts">
defineEmits(['submit'])

</script>

<template>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form class="space-y-6" @submit.prevent="$emit('submit')">
        <slot/>
      </form>
    </div>
  </div>
</template>
