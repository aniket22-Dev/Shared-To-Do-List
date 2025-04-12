import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosInstance from '../axiosInstance';  // Assuming axiosInstance is set up correctly

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null);  // Store user data
    const token = ref<string | null>(null);  // Store JWT token
    const tasks = ref<any[]>([]);  // Store tasks data
    const filter = ref('all');  // Store filter (all, my, shared)

    // Set user data
    const setUser = (userData: any) => {
        user.value = userData;
    };

    // Set token
    const setToken = (authToken: string) => {
        token.value = authToken;
        localStorage.setItem('authToken', authToken);  // Store token in localStorage
    };

    // Logout user
    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('authToken');  // Remove token from localStorage
    };

    // Fetch tasks from backend
    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks');  // Replace with your actual task API endpoint
            tasks.value = response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
        }
    };

    // Create a new task
    const createTask = async (title: string, description: string) => {
        if (!user.value) {
            console.error('User is not authenticated');
            // Optionally, you can redirect to the login page or show an error message
            return;
        }

        try {
            const response = await axiosInstance.post('/tasks', {
                title,
                description,
                created_by: user.value.id,  // Assuming user.id is available
            });
            tasks.value.push(response.data);  // Add task to local tasks array
        } catch (error) {
            console.error('Error creating task:', error.message);
        }
    };

    // Share a task with another user
    const shareTask = async (taskId: number, userId: number) => {
        try {
            const response = await axiosInstance.post('/tasks/share', {
                task_id: taskId,
                user_id: userId,
            });
            console.log('Task shared successfully:', response.data);
        } catch (error: any) {
            console.error('Error sharing task:', error.message);
        }
    };

    // Get filtered tasks based on the current filter
    const getFilteredTasks = () => {
        switch (filter.value) {
            case 'my':
                return tasks.value.filter(task => task.created_by === user.value.id);  // Filter by user ID
            case 'shared':
                return tasks.value.filter(task => task.shared_with.includes(user.value.id));  // Filter by shared tasks
            case 'all':
            default:
                return tasks.value;
        }
    };

    // Set the filter value
    const setFilter = (newFilter: string) => {
        filter.value = newFilter;
    };

    return { user, token, tasks, filter, setUser, setToken, logout, fetchTasks, createTask, shareTask, getFilteredTasks, setFilter };
});
