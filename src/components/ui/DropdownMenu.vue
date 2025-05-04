<template>
  <div
      class="flex justify-end relative"
      ref="dropdownRef"
  >
    <button
        @click.stop="toggleMenu"
        class="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
        aria-haspopup="true"
        :aria-expanded="isOpen"
        aria-label="Действия"
    >
      <Icon
          icon="heroicons:ellipsis-vertical"
          class="h-5 w-5"
      />
    </button>

    <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
      <div
          v-if="isOpen"
          class="origin-top-right absolute right-10 mt-2 w-48 rounded-md shadow-lg bg-white border border-zinc-300 ring-opacity-5 focus:outline-none z-10"
      >
        <div class="py-1">
          <slot :row="row" v-if="visibleActions.length">
            <button
                v-for="action in visibleActions"
                :key="action.key"
                @click.stop="handleActionClick(action)"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
            >
              <Icon
                  :icon="action.icon"
                  class="mr-2 h-4 w-4"
                  :class="action.iconClass"
              />
              {{ action.label }}
            </button>
          </slot>
          <div class="text-sm text-gray-400 p-1" v-else>
            Нет доступных действий.
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { onClickOutside } from '@vueuse/core';

export interface ActionItem {
  key: string;
  label: string;
  icon: string;
  iconClass?: string;
  handler?: (row?: any) => void;
  visible?: boolean | ((row?: any) => boolean);
}

interface Props {
  actions?: ActionItem[];
  menuKey?: string | number;
  modelValue?: boolean;
  row?: any;
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [
    {
      key: 'create-issue',
      label: 'Создать проблему',
      icon: 'heroicons:plus-circle',
      iconClass: 'text-blue-500',
    },
    {
      key: 'delete',
      label: 'Удалить',
      icon: 'heroicons:trash',
      iconClass: 'text-red-500',
    },
  ],
  modelValue: undefined,
  row: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'action', payload: { key: string; row?: any }): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

const dropdownRef = ref<HTMLElement | null>(null);
const localIsOpen = ref(false);

const isOpen = computed({
  get() {
    return props.modelValue !== undefined
        ? props.modelValue
        : localIsOpen.value;
  },
  set(value) {
    if (props.modelValue !== undefined) {
      emit('update:modelValue', value);
    } else {
      localIsOpen.value = value;
    }
    value ? emit('open') : emit('close');
  },
});

const visibleActions = computed(() => {
  return props.actions.filter(action => {
    if (typeof action.visible === 'function') {
      return action.visible(props.row);
    }
    return action.visible !== false;
  });
});

onClickOutside(dropdownRef, () => {
  if (isOpen.value) {
    closeMenu();
  }
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const handleActionClick = (action: ActionItem) => {
  emit('action', { key: action.key, row: props.row });
  action.handler?.(props.row);
  closeMenu();
};
</script>