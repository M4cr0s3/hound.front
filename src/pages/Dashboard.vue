<template>
	<DashboardLayout>
		<DashboardStats />
		<DashboardIssues />
		<DashboardProjects />
	</DashboardLayout>
</template>

<script setup lang="ts">
import DashboardStats from '../components/dashboard/DashboardStats.vue';
import DashboardIssues from '../components/dashboard/DashboardIssues.vue';
import DashboardProjects from '../components/dashboard/DashboardProjects.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
</script>
