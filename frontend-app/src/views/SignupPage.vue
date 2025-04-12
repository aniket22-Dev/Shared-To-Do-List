<template>
    <div class="signup-container">
        <div class="signup-box">
            <h1>Sign Up</h1>
            <form @submit.prevent="signUp">
                <input v-model="email" placeholder="Email" type="email" required />
                <input v-model="password" placeholder="Password" type="password" required />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <router-link to="/">Login here</router-link></p>
        </div>
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

<style scoped>
/* Center the sign-up form and background */
.signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
    padding: 1rem;
}

.signup-box {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    /* Limit max width */
    text-align: center;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

input {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

button {
    width: 100%;
    padding: 0.8rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

button:hover {
    background-color: #218838;
}

p {
    margin-top: 1rem;
    font-size: 1rem;
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>
