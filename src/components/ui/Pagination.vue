<template>
	<div
		class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
	>
		<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
			<div>
				<p class="text-sm text-gray-700">
					Показано с
					<span class="font-medium">{{ pagination.from }}</span>
					по
					<span class="font-medium">{{ pagination.to }}</span>
					из
					<span class="font-medium">{{ pagination.total }}</span>
					{{ text }}
				</p>
			</div>
			<div>
				<nav
					class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
					aria-label="Pagination"
				>
					<button
						v-for="(page, index) in pagination.links"
						:key="page.label"
						:disabled="!page.url || isLoading"
						@click="handlePageChange(page.url)"
						class="relative inline-flex items-center px-4 cursor-pointer py-2 border border-gray-300 text-sm font-medium transition-colors duration-150"
						:class="getButtonClasses(page, index)"
						v-html="page.label"
					/>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Pagination } from '@/api';

interface Props {
	pagination: Pagination;
	isLoading?: boolean;
  text: string
}

const props = withDefaults(defineProps<Props>(), {
	isLoading: false,
});

const emit = defineEmits<{
	(e: 'page-change', url: string | null): void;
}>();

const isFirstPage = computed(() => props.pagination.current_page === 1);
const isLastPage = computed(() => {
	return (
		props.pagination.current_page ===
		Math.ceil(
			props.pagination.total / (props.pagination.to - props.pagination.from + 1)
		)
	);
});

const getButtonClasses = (page: any, index: number) => {
	const classes = [];

	classes.push(
		'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
	);

	if (props.isLoading && page.url) {
		classes.push('opacity-70 cursor-wait');
	}

	if (page.active) {
		classes.push('z-10 bg-indigo-50 border-indigo-500 text-indigo-600');
		return classes.join(' ');
	}

	if (!page.url) {
		classes.push('bg-gray-100 text-gray-300 cursor-not-allowed!');
		return classes.join(' ');
	}

	if (index === 0) {
		classes.push('rounded-l-md bg-white text-gray-500 hover:bg-gray-50');
	} else if (index === props.pagination.links.length - 1) {
		classes.push('rounded-r-md bg-white text-gray-500 hover:bg-gray-50');
	} else {
		classes.push('bg-white text-gray-500 hover:bg-gray-50');
	}

	if (
		(index === 1 && isFirstPage.value) ||
		(index === props.pagination.links.length - 2 && isLastPage.value)
	) {
		classes.push('cursor-not-allowed bg-gray-100');
	}

	return classes.join(' ');
};

const handlePageChange = (url: string | null) => {
	if (!props.isLoading) {
		emit('page-change', url);
	}
};
</script>
