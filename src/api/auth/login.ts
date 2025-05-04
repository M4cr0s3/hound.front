import {httpClient} from '../';

interface AuthBody {
  email: string;
  password: string;
}

type AuthResponse = {
  status: boolean;
  token: string;
  refresh_token: string;
};

export const login = async (body: AuthBody): Promise<AuthResponse> => {
  return httpClient.post('/auth/login', body);
};
