<template>
	<div class="flex items-center">
		<input
			:id="id"
			:value="modelValue"
			:name="name"
			type="checkbox"
			class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
			@change="
				$emit('update:modelValue', ($event.target as HTMLInputElement).checked)
			"
		/>
		<label
			:for="id"
			class="ml-2 block text-sm text-gray-900"
		>
			{{ label }}
		</label>
	</div>
</template>

<script setup lang="ts">
defineProps({
	id: {
		type: String,
		required: true,
	},
	modelValue: {
		type: Boolean,
		default: false,
	},
	name: {
		type: String,
		default: '',
	},
	label: {
		type: String,
		default: '',
	},
});

defineEmits(['update:modelValue']);
</script>
