import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null); // Store user data
    const token = ref<string | null>(null); // Store JWT token

    const setUser = (userData: any) => {
        user.value = userData;
    };

    const setToken = (authToken: string) => {
        token.value = authToken;
        localStorage.setItem('authToken', authToken);  // Store token in localStorage
    };

    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('authToken');  // Remove token from localStorage
    };

    return { user, token, setUser, setToken, logout };
});
