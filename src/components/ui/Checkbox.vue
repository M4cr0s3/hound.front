<template>
	<div class="flex items-center">
		<input
			:id="id"
			:checked="isChecked"
			:name="name"
			type="checkbox"
			class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
			@change="handleChange"
		/>
		<label
			:for="id"
			class="ml-2 block text-sm text-gray-900"
		>
			{{ label }}
		</label>
    <div v-if="error" class="text-red-500 text-xs mt-1">
      {{ error }}
    </div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	modelValue: {
		type: [Boolean, Array] as unknown as () => boolean | any[],
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
	value: {
		type: null,
		required: false,
	},
  error: {
    type: String,
    required: false
  }
});

const emit = defineEmits(['update:modelValue']);

const isChecked = computed(() => {
	if (Array.isArray(props.modelValue)) {
		return props.modelValue.includes(props.value);
	}
	return props.modelValue;
});

const handleChange = (event: Event) => {
	const isChecked = (event.target as HTMLInputElement).checked;

	if (Array.isArray(props.modelValue)) {
		const newValue = [...props.modelValue];
		if (isChecked) {
			if (!newValue.includes(props.value)) {
				newValue.push(props.value);
			}
		} else {
			const index = newValue.indexOf(props.value);
			if (index !== -1) {
				newValue.splice(index, 1);
			}
		}
		emit('update:modelValue', newValue);
	} else {
		emit('update:modelValue', isChecked);
	}
};
</script>
