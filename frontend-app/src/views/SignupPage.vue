<template>
    <div>
        <h1>Sign Up</h1>
        <form @submit.prevent="signUp">
            <input v-model="email" placeholder="Email" type="email" required />
            <input v-model="password" placeholder="Password" type="password" required />
            <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <router-link to="/login">Login here</router-link></p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axiosInstance from '../axiosInstance';

const email = ref('');
const password = ref('');
const router = useRouter();

const signUp = async () => {
    try {
        const response = await axiosInstance.post('/signup', {
            email: email.value,
            password: password.value,
        });

        // Redirect to login page after successful signup
        router.push('/');
    } catch (error: any) {
        console.error('Error signing up:', error.response?.data?.error || error.message);
    }
};
</script>