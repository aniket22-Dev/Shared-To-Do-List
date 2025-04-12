<template>
    <div class="dashboard">
        <h1>Welcome to the Dashboard</h1>
        <p>Your tasks will appear here.</p>
        <div class="task-section">
            <TaskList />
        </div>
        <!-- Log Out Button Positioned at Top Right -->
        <button class="logout-button" @click="logOut">Log Out</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import TaskList from '../components/TaskList.vue';

const router = useRouter();
const authStore = useAuthStore();

const logOut = () => {
    authStore.logout();
    router.push('/');  // Redirect to login after logout
};
</script>

<style scoped>
.dashboard {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem;
    position: relative;
    /* Needed for positioning the logout button */
}

h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
}

.task-section {
    margin-bottom: 2rem;
}

/* Log Out Button Styles */
.logout-button {
    position: absolute;
    /* Position the button relative to the parent .dashboard */
    top: 1rem;
    /* Adjust top position */
    right: 1rem;
    /* Adjust right position */
    background-color: #ff4d4d;
    /* Red color for logout button */
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
}

.logout-button:hover {
    background-color: #e60000;
    /* Darker red on hover */
}
</style>
