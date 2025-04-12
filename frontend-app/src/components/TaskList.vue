<template>
    <div>
        <h2>Tasks</h2>

        <!-- Task filter dropdown -->
        <select v-model="filter" @change="updateFilter">
            <option value="all">All Tasks</option>
            <option value="my">My Tasks</option>
            <option value="shared">Shared Tasks</option>
        </select>

        <!-- List of tasks -->
        <ul>
            <li v-for="task in filteredTasks" :key="task.id">
                <p>{{ task.title }} - {{ task.description }}</p>
                <button @click="shareTask(task.id)">Share Task</button>
            </li>
        </ul>

        <button @click="createNewTask">Create Task</button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';

const taskStore = useAuthStore();
const filter = ref(taskStore.filter);

// Fetch tasks when the component is mounted
onMounted(async () => {
    await taskStore.fetchTasks();  // Fetch tasks from the backend
});

// Filtered tasks based on the current filter
const filteredTasks = computed(() => taskStore.getFilteredTasks());

// Update the filter and fetch tasks accordingly
const updateFilter = () => {
    taskStore.setFilter(filter.value);  // Use setFilter method to change the filter
};

// Create a new task (show modal or redirect to create task page)
const createNewTask = () => {
    // Collect title and description dynamically, for now using placeholders
    const title = prompt('Enter Task Title', 'New Task');
    const description = prompt('Enter Task Description', 'Task description');
    if (title && description) {
        taskStore.createTask(title, description);  // Create task with dynamic input
    }
};

// Share a task (show modal or share task directly)
const shareTask = (taskId: number) => {
    const userId = 1;  // Example user ID to share with
    taskStore.shareTask(taskId, userId);
};
</script>

<style scoped>
/* Add styles here */
.task-list {
    max-width: 800px;
    margin: auto;
    padding: 1rem;
}

select {
    margin-bottom: 1rem;
    padding: 0.5rem;
}

button {
    background-color: #28a745;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #218838;
}
</style>
