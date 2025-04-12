<template>
    <div class="task-list">
        <select v-model="filter" @change="updateFilter">
            <option value="all">All Tasks</option>
            <option value="my">My Tasks</option>
            <option value="shared">Shared Tasks</option>
        </select>

        <div class="tasks-container">
            <div class="task-box" v-for="task in filteredTasks" :key="task.id">
                <span class="task-title">{{ task.title }}</span>
                <p class="task-description">{{ task.description }}</p>
                <button @click="shareTask(task.id)">Share</button>
            </div>
        </div>

        <button @click="createNewTask" style="margin-top: 50px;">Create Task</button>
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
    const title = prompt('Enter Task Title', 'New Task');
    const description = prompt('Enter Task Description', 'Task description');
    if (title && description) {
        taskStore.createTask(title, description);  // Create task with dynamic input
    }
};

// Share a task (show modal or share task directly)
const shareTask = (taskId: number) => {
    taskStore.shareTask(taskId);  // Share task using the taskStore
};
</script>

<style scoped>
.task-list {
    max-width: 1000px;
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

.tasks-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    /* Space between the task boxes */
}

.task-box {
    background-color: #f9f9f9;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: calc(33.333% - 1rem);
    /* 3 items per row, accounting for spacing */
    box-sizing: border-box;
    text-align: center;
}

.task-title {
    font-size: 1.2rem;
    font-weight: bold;
}

.task-description {
    margin: 0.5rem 0;
    font-size: 1rem;
    color: #666;
}

@media (max-width: 768px) {
    .task-box {
        width: calc(50% - 1rem);
        /* 2 items per row on smaller screens */
    }
}

@media (max-width: 480px) {
    .task-box {
        width: 100%;
        /* 1 item per row on very small screens */
    }
}
</style>
