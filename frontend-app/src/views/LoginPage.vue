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
    const response = await axiosInstance.post('/login', {
        email: email.value,
        password: password.value,
    });

    if (response.data.customToken && response.data.userId) {
        // Store the custom token and user ID in localStorage
        localStorage.setItem('customToken', response.data.customToken);
        localStorage.setItem('userId', response.data.userId);

        console.log('Login successful, user authenticated.');
    } else {
        console.error('Login failed, missing custom token or user ID');
    }
    router.push('/dashboard')
};
</script>