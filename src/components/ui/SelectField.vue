<template>
  <div class="relative">
    <Listbox v-model="selectedValue">
      <div class="relative mt-1">
        <ListboxLabel v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
          {{ label }}
        </ListboxLabel>

        <ListboxButton
            class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        >
          <span class="block truncate">
            {{ selectedOptionLabel || placeholder }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon icon="heroicons:chevron-down" class="h-5 w-5 text-gray-400"/>
          </span>
        </ListboxButton>

        <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 focus:outline-none sm:text-sm"
        >
          <ListboxOption
              v-for="option in options"
              :key="getOptionValue(option)"
              v-slot="{ active, selected }"
              :value="getOptionValue(option)"
              as="template"
          >
            <li
                :class="[
                  active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-3 pr-9'
                ]"
            >
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                  {{ getOptionLabel(option) }}
                </span>

              <span
                  v-if="selected"
                  :class="[
                    'absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600'
                  ]"
              >
                  <Icon class="h-5 w-5" icon="heroicons:check"/>
                </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>

    <p v-if="description" class="mt-2 text-sm text-gray-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions} from '@headlessui/vue'
import {computed} from 'vue'
import {Icon} from "@iconify/vue";

const props = defineProps({
  modelValue: {
    type: [Object, String, Number],
    default: null
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  description: {
    type: String,
    default: ''
  },
  optionLabel: {
    type: String,
    default: 'name'
  },
  optionValue: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedOption = computed(() => {
  return props.options.find(option =>
      getOptionValue(option) === selectedValue.value
  )
})

const selectedOptionLabel = computed(() => {
  return selectedOption.value ? getOptionLabel(selectedOption.value) : null
})

const getOptionLabel = (option: any) => {
  return typeof option === 'object' ? option[props.optionLabel] : option
}

const getOptionValue = (option: any) => {
  return typeof option === 'object' ? option[props.optionValue] : option
}
</script>

<style scoped>

</style>