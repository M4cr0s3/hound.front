import { api } from '../';

interface AuthBody {
	email: string;
	password: string;
}

type AuthResponse = {
	data: {
		status: boolean;
		token: string;
	};
};

export const login = async (body: AuthBody) => {
	return api.post<AuthBody, AuthResponse>('/auth/login', body);
};
