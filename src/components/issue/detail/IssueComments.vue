<template>
  <div class="space-y-4 mb-2">
    <div v-for="comment in comments" :key="comment.id" class="relative">
      <div class="flex space-x-3">
        <div class="flex-shrink-0">
          <Avatar :name="comment.user.name" size="sm"/>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 text-sm">
              <span class="font-medium text-gray-900">{{ comment.user.name }}</span>
              <span class="text-gray-500">{{ formatDate(comment.created_at) }}</span>
            </div>
            <Icon
                icon="heroicons:trash"
                @click="deleteComment(comment.id)"
                class="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                v-if="comment.user.id === usersStore.currentUser?.id"
            />
          </div>


          <!--            <button-->
          <!--                @click="startReply(comment)"-->
          <!--                class="text-indigo-500 hover:text-indigo-700 text-xs"-->
          <!--            >-->
          <!--              Ответить-->
          <!--            </button>-->

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
import { type Comment, httpClient, type Id } from "@/api";
import { Avatar } from "@/components/ui";
import { useUsersStore } from "@/stores";
import { Icon } from '@iconify/vue';
import hljs from "highlight.js";
import 'highlight.js/styles/paraiso-dark.min.css';
import MarkdownIt from 'markdown-it';
import { toast } from "vue-sonner";

const props = withDefaults(defineProps<{
  comments: Comment[] | undefined,
  showParentReferences?: boolean
}>(), {
  showParentReferences: false
})
const emit = defineEmits(['submit-reply', 'deleted']);

const usersStore = useUsersStore();

// const replyText = ref('');
// const replyingTo = ref<number | null>(null);
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

const deleteComment = async (id: Id) => {
  try {
    await httpClient.delete(`/comments/${id}`);
    emit('deleted');
    toast.success('Комментарий успешно удален');
  } catch (e: any) {
    toast.error('Произошла ошибка при удалении комментария', {
      description: e.data.message,
    });
  }
}

//
// const startReply = (comment: Comment) => {
//   replyingTo.value = comment.id;
//   replyText.value = '';
// };

</script>

<style scoped>
</style>