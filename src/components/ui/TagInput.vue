<template>
	<div>
		<label class="block text-sm font-medium text-gray-700">Теги</label>
		<div class="mt-1 flex flex-wrap gap-2 border rounded-md p-2">
			<span
				v-for="tag in value"
				:key="tag"
				class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
			>
				{{ tag }}
				<button
					type="button"
					class="ml-1 text-gray-500 hover:text-gray-700"
					@click="removeTag(tag)"
				>
					×
				</button>
			</span>
			<input
				v-model="newTag"
				type="text"
				class="flex-1 border-none focus:ring-0 sm:text-sm"
				placeholder="Добавить тег..."
				@keyup.enter="addTag"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
	value: string[];
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string[]): void;
}>();

const newTag = ref('');

const addTag = () => {
	if (newTag.value.trim() && !props.value.includes(newTag.value.trim())) {
		emit('update:modelValue', [...props.value, newTag.value.trim()]);
		newTag.value = '';
	}
};

const removeTag = (tag: string) => {
	emit(
		'update:modelValue',
		props.value.filter((t) => t !== tag)
	);
};
</script>
