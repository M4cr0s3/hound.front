<template>
  <div class="h-screen flex flex-col">
    <div class="flex flex-1 overflow-hidden">
      <DashboardSidebar />

      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <DashboardHeader />

        <main class="flex-1 overflow-y-auto bg-gray-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue';
</script>