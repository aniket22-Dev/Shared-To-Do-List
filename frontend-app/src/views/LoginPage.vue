<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="logIn">
            <input v-model="email" placeholder="Email" type="email" required />
            <input v-model="password" placeholder="Password" type="password" required />
            <button type="submit">Log In</button>
        </form>
        <p>Don't have an account? <router-link to="/signup">Sign up here</router-link></p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axiosInstance from '../axiosInstance';
import { useAuthStore } from '../stores/authStore';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const logIn = async () => {
    try {
        const response = await axiosInstance.post('/login', {
            email: email.value,
            password: password.value,
        });

        // Save token in store and localStorage
        authStore.setToken(response.data.customToken);

        // Redirect to dashboard
        router.push('/dashboard');
    } catch (error) {
        console.error('Error logging in:', error.response?.data?.error || error.message);
    }
};
</script>