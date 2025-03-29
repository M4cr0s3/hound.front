<script setup lang="ts">
import {Icon} from "@iconify/vue";
</script>

<template>
  <header class="bg-white shadow-sm h-16 flex items-center border-b border-gray-200">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <div class="w-64"></div>

        <div class="flex-1 flex justify-end items-center space-x-4">
          <div class="relative max-w-md w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="heroicons:magnifying-glass" class="h-5 w-5 text-gray-500"/>
            </div>
            <input
                type="search"
                placeholder="Искать проект, задачу, команду..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
              class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <Icon icon="heroicons:bell"/>
          </button>

          <div class="relative">
            <div class="flex items-center space-x-2 cursor-pointer">
              <img class="h-8 w-8 rounded-full" src="https://avatars.githubusercontent.com/u/1?v=4" alt="User avatar"/>
              <Icon icon="heroicons:chevron-down" class="h-5 w-5 text-gray-500"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>