<template>
  <div class="space-y-4" @keydown.alt.left.stop="prevTab" @keydown.alt.right.stop="nextTab">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :class="[
            activeTab === tab.name
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer',
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div v-show="activeTab === 'write'" class="relative">
      <div
          class="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-200">
        <textarea
            ref="textareaRef"
            id="comment"
            v-model="comment"
            rows="8"
            class="block w-full focus:outline-none resize-none border-0 bg-transparent py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 font-mono"
            placeholder="Напишите ваш комментарий (поддерживается Markdown)..."

            @keydown="handleKeyDown"
            @input="checkForMention"
        />

        <div
            v-if="showUserSuggestions"
            class="absolute z-10 mt-1 w-64 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <div
              v-for="(user, index) in userSuggestions"
              :key="user.id"
              @click="insertUserMention(user)"
              class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-indigo-50"
              :class="{ 'bg-indigo-100': selectedSuggestionIndex === index }"
          >
            <div class="flex items-center">
              <span class="ml-3 block truncate text-gray-700 font-medium">{{ user.name }}</span>
            </div>
          </div>
          <div v-if="userSuggestions.length === 0" class="px-4 py-2 text-gray-500 text-sm">
            Пользователи не найдены
          </div>
        </div>

        <div
            class="absolute inset-x-0 bottom-0 flex justify-between items-center py-2 pl-3 pr-2 bg-gray-50 border-t border-gray-200">
          <div class="flex items-center space-x-2">
            <button
                type="button"
                @click="insertText('**', '**')"
                class="rounded p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title="Жирный текст"
            >
              <Icon icon="mdi:format-bold" class="h-5 w-5"/>
            </button>
            <button
                type="button"
                @click="insertText('*', '*')"
                class="rounded p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title="Курсив"
            >
              <Icon icon="mdi:format-italic" class="h-5 w-5"/>
            </button>
            <button
                type="button"
                @click="insertText('[', '](url)')"
                class="rounded p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title="Ссылка"
            >
              <Icon icon="mdi:link-variant" class="h-5 w-5"/>
            </button>
            <button
                type="button"
                @click="insertText('```\n', '\n```')"
                class="rounded p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title="Блок кода"
            >
              <Icon icon="mdi:code-tags" class="h-5 w-5"/>
            </button>
            <button
                type="button"
                @click="insertText('- ', '')"
                class="rounded p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title="Список"
            >
              <Icon icon="mdi:format-list-bulleted" class="h-5 w-5"/>
            </button>
            <button
                type="button"
                @click="insertText('> ', '')"
                class="rounded p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title="Цитата"
            >
              <Icon icon="mdi:format-quote-open" class="h-5 w-5"/>
            </button>
          </div>

          <div class="text-xs text-gray-500">
            Поддерживается Markdown. Ctrl+Enter для отправки
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTab === 'preview'" class="prose prose-sm max-w-none p-4 rounded-lg border border-gray-200">
      <div v-if="renderedMarkdown" v-html="renderedMarkdown"/>
      <div v-else class="text-gray-400 italic">
        Превью будет отображаться здесь...
      </div>
    </div>

    <div class="flex justify-end">
      <Button
          type="button"
          @click="handleSubmit"
          :disabled="isLoading || !comment.trim()"
      >
        <span v-if="isLoading" class="flex items-center">
          <Icon icon="mdi:loading" class="h-4 w-4 animate-spin mr-2"/>
          Отправка...
        </span>
        <span v-else class="flex items-center">
          <Icon icon="mdi:send" class="h-4 w-4 mr-2"/>
          Отправить
        </span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {Icon} from '@iconify/vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import {Button} from "@/components/ui";
import {httpClient} from "@/api";
import {useDebounceFn} from "@vueuse/core";

const props = defineProps<{
  isLoading: boolean;
  initialValue?: string;
}>();

const emit = defineEmits(['submit']);

const activeTab = ref<'write' | 'preview'>('write');
const comment = ref(props.initialValue || '');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const showUserSuggestions = ref(false);
const userSuggestions = ref([]);
const selectedSuggestionIndex = ref(0);
const currentMentionQuery = ref('');
const mentionStartPos = ref(-1);

const tabs = [
  {name: 'write', label: 'Редактор'},
  {name: 'preview', label: 'Превью'},
];

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, {language: lang}).value;
      } catch (__) {
      }
    }
    return '';
  }
});

const renderedMarkdown = computed(() => {
  return comment.value.trim() ? md.render(comment.value) : null;
});

const handleSubmit = () => {
  if (!comment.value.trim()) return;
  emit('submit', comment.value.trim());
  comment.value = '';
};


const insertText = (prefix: string, suffix: string) => {
  if (!textareaRef.value) return;

  const start = textareaRef.value.selectionStart;
  const end = textareaRef.value.selectionEnd;
  const selectedText = comment.value.substring(start, end);
  const beforeText = comment.value.substring(0, start);
  const afterText = comment.value.substring(end);

  comment.value = beforeText + prefix + selectedText + suffix + afterText;

  nextTick(() => {
    if (!textareaRef.value) return;
    textareaRef.value.focus();
    const newCursorPos = start + prefix.length;
    textareaRef.value.setSelectionRange(
        selectedText ? newCursorPos : newCursorPos,
        selectedText ? newCursorPos + selectedText.length : newCursorPos
    );
  });
};

const prevTab = () => {
  const currentIndex = tabs.findIndex(tab => tab.name === activeTab.value);
  const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  activeTab.value = tabs[prevIndex].name;
};

const nextTab = () => {
  const currentIndex = tabs.findIndex(tab => tab.name === activeTab.value);
  const nextIndex = (currentIndex + 1) % tabs.length;
  activeTab.value = tabs[nextIndex].name;
};

const searchUsers = useDebounceFn(async (query: string) => {
  try {
    userSuggestions.value = await httpClient.get(`/api/users/search?q=${query}`);
  } catch (error) {
    console.error('Ошибка при поиске пользователей:', error);
    userSuggestions.value = [];
  }
}, 300);

const checkForMention = () => {
  const cursorPos = textareaRef.value.selectionStart;
  const textBeforeCursor = comment.value.substring(0, cursorPos);

  const lastAtPos = textBeforeCursor.lastIndexOf('@');

  if (Math.abs(cursorPos - lastAtPos) === 1) {
    return;
  }

  if (lastAtPos >= 0 && (lastAtPos === 0 || /\s/.test(textBeforeCursor[lastAtPos - 1]))) {
    console.log(cursorPos, lastAtPos, textBeforeCursor);

    const text = textBeforeCursor.substring(lastAtPos + 1);
    if (!text.trim()) return;
    if (/\s/.test(text)) return;

    mentionStartPos.value = lastAtPos;
    currentMentionQuery.value = textBeforeCursor.substring(lastAtPos + 1);
    showUserSuggestions.value = true;
    selectedSuggestionIndex.value = 0;
    searchUsers(currentMentionQuery.value);
  } else {
    console.log(cursorPos, lastAtPos);
    showUserSuggestions.value = false;
  }
};


const insertUserMention = (user) => {
  if (!textareaRef.value) return;

  const textarea = textareaRef.value;
  const startPos = mentionStartPos.value;
  const endPos = textarea.selectionStart;

  const beforeText = comment.value.substring(0, startPos);
  const afterText = comment.value.substring(endPos);

  comment.value = beforeText + `@${user.name} ` + afterText;
  showUserSuggestions.value = false;

  nextTick(() => {
    textarea.focus();
    const newCursorPos = startPos + user.name.length + 2;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  });
};

const handleKeyDown = (e) => {
  if (showUserSuggestions.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedSuggestionIndex.value = Math.min(selectedSuggestionIndex.value + 1, userSuggestions.value.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (userSuggestions.value[selectedSuggestionIndex.value]) {
        insertUserMention(userSuggestions.value[selectedSuggestionIndex.value]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      showUserSuggestions.value = false;
    }
  }

  if (e.altKey) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevTab();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextTab();
    }
  }
};
const handleClickOutside = (e) => {
  if (textareaRef.value && !textareaRef.value.contains(e.target)) {
    showUserSuggestions.value = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('click', handleClickOutside);
});

watch(() => props.initialValue, (newVal) => {
  if (newVal) comment.value = newVal;
});
</script>

<style scoped>
.user-suggestions {
  z-index: 10;
  position: absolute;
  margin-top: 0.25rem;
  width: 100%;
  max-height: 15rem;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.user-suggestion {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.user-suggestion:hover {
  background-color: #f3f4f6;
}

.user-suggestion.selected {
  background-color: #e0e7ff;
}

textarea {
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f5f3ff;
  min-height: 150px;
}

textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f5f3ff;
}

textarea::-webkit-scrollbar-thumb {
  background-color: #c7d2fe;
  border-radius: 3px;
}

.prose :deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}

.prose :deep(code) {
  background-color: rgba(175, 184, 193, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 85%;
}

.prose :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  padding-left: 16px;
  color: #57606a;
  margin-left: 0;
}

.prose :deep(img) {
  max-width: 100%;
  border-radius: 6px;
  margin: 1em 0;
}
</style>