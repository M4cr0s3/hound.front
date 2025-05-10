<template>
  <DataTable
      :columns="columns"
      :data="users"
      :pagination="pagination"
      :is-loading="isLoading"
      row-clickable
      @row-click="emit('select', $event)"
      @page-change="handlePageChange"
      row-class="text-sm text-gray-700"
      pagination-text="пользователей"
  >
    <template #cell-role="{ value }: { value: Role }">
      <span
          :class="{
            'bg-green-100 text-green-800': value.title === RoleTitle.Maintainer,
            'bg-blue-100 text-blue-800': value.title === RoleTitle.Developer,
          }"
          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
      >
        {{ value.title }}
      </span>
    </template>
    <template #cell-actions="{ row }" v-if="usersStore.currentUser?.role.title === RoleTitle.Maintainer">
      <td class="text-center">
        <DropdownMenu
            :row
            :actions
        />
      </td>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {DataTable, DropdownMenu, type ActionItem} from '@/components/ui';
import {type Pagination, type Role, RoleTitle, type User} from '@/api';
import {toast} from "vue-sonner";
import {useUsersStore} from "@/stores";

const props = defineProps<{
  users: User[];
  pagination: Pagination;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', user: User): void;
  (e: 'page-change', url: string | null): void;
}>();

const usersStore = useUsersStore();

const columns = [
  {key: 'name', title: 'Имя'},
  {key: 'email', title: 'Почта'},
  {key: 'role', title: 'Роль'},
  {key: 'actions', title: 'Действия', visible: usersStore.currentUser?.role.title === RoleTitle.Maintainer},
];

const actions = ref<ActionItem[]>([
  {
    icon: 'heroicons:clipboard',
    label: 'Скопировать инвайт-ссылку',
    handler: (row) => handleCopyInviteLink(row),
    visible: row => row.invitations?.length,
  },
  {
    icon: 'heroicons:trash',
    label: 'Удалить',
    iconClass: 'text-red-500',
    handler: (row) => usersStore.destroy(row.id),
  }
]);

const handleCopyInviteLink = async (user: User) => {
  const url = new URL(window.location.origin);
  const invitationsLength = user.invitations?.length;

  if (!invitationsLength) {
    return;
  }

  url.pathname = `/invite/${user.invitations[invitationsLength - 1].token}`;
  await navigator.clipboard.writeText(url.toString());
  toast.success('Ссылка скопирована в буфер обмена');
};

const handlePageChange = (url: string | null) => {
  if (url) {
    const page = new URL(url).searchParams.get('page');
    if (page) {
      emit('page-change', page);
    }
  }
};
</script>