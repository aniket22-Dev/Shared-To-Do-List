<template>
    <div>
        <h1>Welcome to the Dashboard</h1>
        <p>Your tasks will appear here.</p>
        <button @click="logOut">Log Out</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const logOut = () => {
    authStore.logout();
    router.push('/');  // Redirect to login after logout
};
</script>