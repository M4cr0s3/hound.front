import {type Ref, ref} from 'vue';
import {login} from '@/api';
import {useRouter} from 'vue-router';
import {ROUTES} from '../router/routes.ts';
import {toast} from "vue-sonner";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginError {
  fieldErrors: {
    email?: string;
    password?: string;
  };
  commonError?: string;
}

export interface UseLoginReturn {
  credentials: Ref<LoginCredentials>;
  errors: Ref<LoginError>;
  isLoading: Ref<boolean>;
  handleSubmit: () => Promise<void>;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();

  const credentials = ref<LoginCredentials>({
    email: '',
    password: '',
  });

  const errors = ref<LoginError>({
    fieldErrors: {},
    commonError: '',
  });

  const isLoading = ref(false);

  const resetErrors = (): void => {
    errors.value = {
      fieldErrors: {},
      commonError: '',
    };
  };

  const handleSubmit = async (): Promise<void> => {
    resetErrors();
    isLoading.value = true;

    try {
      const response = await login(credentials.value);

      if (!response?.token) return;

      localStorage.setItem('token', response.token);
      await router.push(ROUTES.DASHBOARD);
    } catch (error: unknown) {
      if (error.status === 422 || error.status === 403) {
        toast.error('Неправильный логин или пароль', {duration: 3000, description: error.message});
        errors.value.commonError = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    credentials,
    errors,
    isLoading,
    handleSubmit,
  };
};
