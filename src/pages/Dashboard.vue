<template>
  <div class="h-screen flex flex-col">
    <div class="flex flex-1 overflow-hidden">
      <DashboardSidebar />

      <div class="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main class="flex-1 overflow-y-auto bg-gray-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <DashboardStats />
            <DashboardIssues />
            <DashboardProjects />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue';
import DashboardStats from '../components/dashboard/DashboardStats.vue';
import DashboardIssues from '../components/dashboard/DashboardIssues.vue';
import DashboardProjects from '../components/dashboard/DashboardProjects.vue';
</script>