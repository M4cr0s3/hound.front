<template>
  <div class="space-y-4 mb-2">
    <div v-for="comment in comments" :key="comment.id" class="relative">
      <div class="flex space-x-3">
        <div class="flex-shrink-0">
          <Avatar :name="comment.user.name" size="sm"/>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 text-sm">
            <span class="font-medium text-gray-900">{{ comment.user.name }}</span>
            <span class="text-gray-500">{{ formatDate(comment.created_at) }}</span>

<!--            <button-->
<!--                @click="startReply(comment)"-->
<!--                class="text-indigo-500 hover:text-indigo-700 text-xs"-->
<!--            >-->
<!--              Ответить-->
<!--            </button>-->
          </div>

          <div class="mt-1 flex items-center text-sm text-gray-700">
            <template v-if="comment.parent && showParentReferences">
              <span class="text-gray-500">@{{ comment.parent.user.name }}</span>
              <span class="text-gray-300 mx-1">•</span>
            </template>
            <span v-html="renderMarkdown(comment.text)"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {Comment} from "@/api";
import {Avatar} from "@/components/ui";
import MarkdownIt from 'markdown-it';
import hljs from "highlight.js";
import 'highlight.js/styles/paraiso-dark.min.css';


const props = withDefaults(defineProps<{
  comments: Comment[],
  showParentReferences?: boolean
}>(), {
  showParentReferences: false
})

const emit = defineEmits(['submit-reply']);

const replyText = ref('');
const replyingTo = ref<number | null>(null);
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

const renderMarkdown = (text: string) => {
  return md.render(text.trim());
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const startReply = (comment: Comment) => {
  replyingTo.value = comment.id;
  replyText.value = '';
};

</script>

<style scoped>
</style>