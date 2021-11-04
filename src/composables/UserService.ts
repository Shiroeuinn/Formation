import { ref } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
import { UserModel } from '@/models/UserModel';

export function retrieveUser(): UserModel | null {
  const userAsString = window.localStorage.getItem('rememberMe');
  return userAsString ? JSON.parse(userAsString) : null;
}

const userModel = ref(retrieveUser());

function storeLoggedInUser(user: UserModel): void {
  userModel.value = user;
  window.localStorage.setItem('rememberMe', JSON.stringify(user));
}

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  if (userModel.value) {
    config.headers.Authorization = `Bearer ${userModel.value.token}`;
  }
  return config;
});

export function useUserService() {
  return {
    userModel,

    async register(user: UserModel): Promise<UserModel> {
      const response = await axios.post<UserModel>('https://ponyracer.ninja-squad.com/api/users', user);
      storeLoggedInUser(response.data);
      return response.data;
    },

    async authenticate(credentials: { login: string; password: string }): Promise<UserModel> {
      const response = await axios.post<UserModel>('https://ponyracer.ninja-squad.com/api/users/authentication', credentials);
      storeLoggedInUser(response.data);
      return response.data;
    },

    logoutAndForget(): void {
      userModel.value = null;
      window.localStorage.removeItem('rememberMe');
    }
  };
}
