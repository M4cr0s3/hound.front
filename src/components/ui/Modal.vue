<template>
  <transition name="modal">
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        aria-modal="true"
        role="dialog"
    >
      <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 "
      >
        <div
            class="fixed inset-0 bg-gray-500/75 -z-10 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            @click="close"
        ></div>

        <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
        >&#8203;</span
        >

        <div
            ref="modalRef"
            class="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 rounded-lg pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3
                    class="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                >
                  <slot name="title"></slot>
                </h3>
                <div class="mt-2">
                  <slot name="content"></slot>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse z-10" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from 'vue';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const modalRef = ref<HTMLDivElement | null>(null);

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

onClickOutside(
    () => modalRef.value,
    () => {
      close();
    }
);

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
