import { type Ref, ref } from 'vue';
import { login } from '../api';
import { useRouter } from 'vue-router';
import { ROUTES } from '../router/routes.ts';

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface ApiErrorResponse {
	message?: string;
	errors?: Record<string, string[]>;
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

	const extractErrors = (errorResponse: ApiErrorResponse): LoginError => {
		const result: LoginError = {
			fieldErrors: {},
			commonError: '',
		};

		if (errorResponse.errors) {
			for (const [field, messages] of Object.entries(errorResponse.errors)) {
				if (field === 'email' || field === 'password') {
					result.fieldErrors[field] = messages[0];
				} else {
					console.log('wf');
					result.commonError = result.commonError
						? `${result.commonError} ${messages.join(' ')}`
						: messages.join(' ');
				}
			}
		}

		return result;
	};

	const handleSubmit = async (): Promise<void> => {
		resetErrors();
		isLoading.value = true;

		try {
			const response = await login(credentials.value);

			localStorage.setItem('token', response.data!.token);
			await router.push(ROUTES.INDEX);
		} catch (error: unknown) {
			if (isApiErrorResponse(error)) {
				errors.value = extractErrors(error.response.data);

				if (error.response.status === 401) {
					errors.value.commonError = 'Неверный email или пароль';
				}
			} else {
				errors.value.commonError = 'Произошла ошибка при соединении с сервером';
			}
		} finally {
			isLoading.value = false;
		}
	};

	const isApiErrorResponse = (
		error: unknown
	): error is { response: { data: ApiErrorResponse; status: number } } => {
		return (
			typeof error === 'object' &&
			error !== null &&
			'response' in error &&
			typeof (error as { response: { data: ApiErrorResponse; status: number } })
				.response?.data === 'object'
		);
	};

	return {
		credentials,
		errors,
		isLoading,
		handleSubmit,
	};
};
