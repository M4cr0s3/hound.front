<template>
  <div class="relative">
    <Listbox v-model="selectedValues" :multiple="multiple">
      <div class="relative mt-1">
        <ListboxLabel
            v-if="label"
            class="block text-sm font-medium text-gray-700 mb-1"
        >
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </ListboxLabel>

        <ListboxButton
            class="relative w-full cursor-pointer rounded-md border py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm"
            :class="[
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
          ]"
        >
          <span class="block truncate">
            <template v-if="multiple">
              <template v-if="selectedValues.length === 0">
                {{ placeholder }}
              </template>
              <template v-else>
                {{ selectedValues.length }} выбрано
              </template>
            </template>
            <template v-else>
              {{ displayValue || placeholder }}
            </template>
          </span>
          <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <Icon
                icon="mdi:chevron-down"
                class="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
          <ListboxOptions
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg border border-gray-200 focus:outline-none sm:text-sm"
          >
            <div class="px-3 py-2" v-if="searchable">
              <input
                  v-model="searchQuery"
                  type="text"
                  class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Поиск..."
              />
            </div>
            <div v-if="options.length === 0" class="py-2 px-3 text-sm text-gray-500">
              Нет результатов
            </div>
            <ListboxOption
                v-for="option in options"
                :key="getOptionValue(option)"
                v-slot="{ active, selected }"
                :value="getOptionValue(option)"
                class="cursor-pointer"
                as="template"
            >
              <li
                  :class="[
                  active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                ]"
              >
                <template v-if="multiple">
                  <div class="flex items-center">
                    <input
                        type="checkbox"
                        :checked="selected"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        @click.stop
                    >
                    <span
                        :class="[
                        selected ? 'font-semibold' : 'font-normal',
                        'ml-3 block truncate',
                      ]"
                    >
                      {{ getOptionLabel(option) }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <span
                      :class="[
                      selected ? 'font-semibold' : 'font-normal',
                      'block truncate',
                    ]"
                  >
                    {{ getOptionLabel(option) }}
                  </span>
                </template>

                <span
                    v-if="selected && !multiple"
                    :class="[
                    'absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600',
                  ]"
                >
                  <Icon
                      class="h-5 w-5"
                      icon="mdi:check"
                  />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>

    <div v-if="multiple && selectedValues.length > 0" class="mt-2 flex flex-wrap gap-2">
      <span
          v-for="value in selectedValues"
          :key="value"
          class="inline-flex items-center rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
      >
        {{ getOptionLabel(getOptionByValue(value)) }}
        <button
            type="button"
            @click.stop="removeSelectedValue(value)"
            class="ml-1.5 inline-flex text-indigo-600 hover:text-indigo-900 cursor-pointer"
        >
          <Icon icon="mdi:close" class="h-3 w-3"/>
        </button>
      </span>
    </div>

    <p
        v-if="description && !error"
        class="mt-2 text-sm text-gray-500"
    >
      {{ description }}
    </p>

    <p
        v-if="error"
        class="mt-2 text-sm text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import {computed, ref} from 'vue';
import {Icon} from '@iconify/vue';
import {watchDebounced} from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: [Object, String, Number, Array] as any,
    default: null,
  },
  options: {
    type: Array as () => any[],
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Выберите опцию',
  },
  description: {
    type: String,
    default: '',
  },
  optionLabel: {
    type: String,
    default: 'name',
  },
  optionValue: {
    type: String,
    default: 'id',
  },
  noOptionsValue: {
    type: String,
    default: 'Нет доступных значений',
  },
  error: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  searchDebounce: {
    type: Number,
    default: 300,
  },
  required: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['update:modelValue', 'search']);

const searchQuery = ref('');

watchDebounced(
    searchQuery,
    (value) => {
      emit('search', value);
    },
    {debounce: props.searchDebounce}
);

const selectedValues = computed({
  get: () => {
    if (props.multiple) {
      return Array.isArray(props.modelValue) ? props.modelValue : [];
    }

    if (props.options.length === 0 && !props.modelValue) {
      return props.noOptionsValue;
    }
    return props.modelValue;
  },
  set: (value) => {
    if (props.multiple) {
      emit('update:modelValue', value);
    } else if (value !== props.noOptionsValue) {
      emit('update:modelValue', value);
    }
  },
});

const getOptionByValue = (value: any) => {
  return props.options.find(option => getOptionValue(option) === value);
};

const selectedOption = computed(() => {
  if (props.multiple) return null;
  return props.options.find(
      (option) => getOptionValue(option) === selectedValues.value
  );
});

const displayValue = computed(() => {
  if (props.multiple) return null;

  if (selectedOption.value) {
    return getOptionLabel(selectedOption.value);
  }
  if (props.options.length === 0) {
    return props.noOptionsValue;
  }
  return null;
});

const getOptionLabel = (option: any) => {
  return typeof option === 'object' ? option[props.optionLabel] : option;
};

const getOptionValue = (option: any) => {
  return typeof option === 'object' ? option[props.optionValue] : option;
};

const removeSelectedValue = (value: any) => {
  if (!props.multiple) return;

  const newValues = selectedValues.value.filter(v => v !== value);
  emit('update:modelValue', newValues);
};
</script>