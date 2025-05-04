<template>
	<div
		class="flex-shrink-0 rounded-md flex items-center justify-center"
		:class="[
			sizeClasses[props.size as keyof typeof sizeClasses],
			colorClasses[project.platform as keyof typeof colorClasses] ||
				'bg-indigo-100 text-indigo-600',
		]"
	>
		<Icon
			:icon="icon"
			:class="iconSizeClasses[props.size as keyof typeof iconSizeClasses]"
		/>
	</div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const props = defineProps({
	project: {
		type: Object,
		required: true,
	},
	size: {
		type: String,
		default: 'md',
		validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
	},
});

const sizeClasses = {
	sm: 'h-8 w-8',
	md: 'h-10 w-10',
	lg: 'h-12 w-12',
};

const iconSizeClasses = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
};

const colorClasses = {
	javascript: 'bg-yellow-100 text-yellow-600',
	react: 'bg-blue-100 text-blue-600',
	vue: 'bg-green-100 text-green-600',
	node: 'bg-green-100 text-green-600',
};

const icon = computed(() => {
	const icons = {
		javascript: 'logos:javascript',
		react: 'logos:react',
		vue: 'logos:vue',
		node: 'logos:nodejs-icon',
	};
	return (
		icons[props.project.platform as keyof typeof icons] || 'heroicons:folder'
	);
});
</script>
