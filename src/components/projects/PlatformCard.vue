<template>
	<div>
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
			<button
				v-for="platform in filteredPlatforms"
				:key="platform.id"
				@click.prevent="updateModelValue(platform)"
				class="p-3 border rounded-lg flex flex-col items-center transition-colors cursor-pointer"
				:class="{
					'border-indigo-500 bg-indigo-50': modelValue === platform.name,
					'border-gray-200 hover:border-gray-300': modelValue !== platform.name,
				}"
			>
				<Icon
					:icon="platform.icon"
					class="w-8 h-8 mb-2"
				/>
				<span class="text-sm text-center">{{ platform.name }}</span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { type Platform, PLATFORMS } from '@/data';

const props = defineProps<{
	category?: string;
	modelValue: string | null;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const filteredPlatforms = computed(() => {
	return props.category
		? PLATFORMS.filter((p) => p.categories.includes(props.category! as never))
		: PLATFORMS;
});

const updateModelValue = (platform: Platform) => {
	emit('update:modelValue', platform.name);
};
</script>
