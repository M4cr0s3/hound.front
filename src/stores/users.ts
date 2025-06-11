import type { BaseResponse, Id, Pagination, User } from "@/api";
import { httpClient } from "@/api";
import { ROUTES } from "@/router/routes.ts";
import { defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export interface UserFilters {
  search: string;
  page: number;
  perPage?: number;
}

type CreateUserBody = {
  name: string;
  email: string;
  role_id: number;
};

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([]);
  const currentUser = ref<User>({} as User);
  const filters = ref<UserFilters>({
    search: '',
    page: 1,
    perPage: 10
  });
  const errors = ref<Record<string, string[]>>({});
  const isLoading = ref(false);
  const pagination = ref<Pagination>();
  const router = useRouter();

  // Actions
  async function fetchUsers() {
    try {
      isLoading.value = true;
      const response = await httpClient.get<{
        users: User[],
        pagination: Pagination,
      }>('/users', {
        query: filters.value
      });

      users.value = response.users;
      pagination.value = response.pagination;
    } finally {
      isLoading.value = false;
    }
  }

  async function getCurrentUser() {
    currentUser.value = (await httpClient.get<{ user: User }>('/users/me')).user;
  }

  async function createUser(data: CreateUserBody) {
    isLoading.value = true;
    try {
      const res = await httpClient.post<BaseResponse>('/users', data);

      if (res.success) {
        await router.push(ROUTES.USER.INDEX);
      }
    } catch (e: any) {
      errors.value = e.data.errors;
    } finally {
      isLoading.value = false;
    }
  }

  const logout = async () => {
    const response = await httpClient.get<any>('/auth/logout');

    if (response.status === 'success') {
      localStorage.removeItem('token');
      await router.push('/login');
    }
  };

  const destroy = async (id: Id) => {
    await httpClient.delete(`/users/${id}`);
    await fetchUsers();
  }

  // Getters
  const getError = computed(() => (key: string) => errors.value[key]);

  onMounted(async () => {
    if (localStorage.getItem('token')) {
      await getCurrentUser();
    }
  });

  return {
    // State
    users,
    filters,
    errors,
    isLoading,
    pagination,
    currentUser,

    // Actions
    fetchUsers,
    getCurrentUser,
    createUser,
    logout,
    destroy,

    // Getters
    getError
  };
});