<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Комментарии</h3>
    </div>


    <div class="px-4 py-5 sm:p-6">
      <IssueComments :comments="comments" show-parent-references/>

      <CommentForm
          @submit="handleCommentSubmit"
          :is-loading="isCommentLoading"
      />

      <!--      <div class="mt-6 space-y-6">-->
      <!--        <ActivityItem-->
      <!--            v-for="activity in activities"-->
      <!--            :key="activity.id"-->
      <!--            :activity="activity"-->
      <!--        />-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {CommentForm, ActivityItem} from '@/components/ui';
import {type Comment, IssuesApi} from '@/api';
import IssueComments from "@/components/issue/detail/IssueComments.vue";

const props = defineProps<{
  issueId: number;
  comments: Comment[];
}>();

const emit = defineEmits(['comment-added']);

const isCommentLoading = ref(false);

const handleCommentSubmit = async (text: string) => {
  isCommentLoading.value = true;
  try {
    await IssuesApi.addComment(props.issueId, text);
    emit('comment-added');
  } catch (error) {
    console.error('Error adding comment:', error);
  } finally {
    isCommentLoading.value = false;
  }
};
</script>