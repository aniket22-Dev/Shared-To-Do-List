import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosInstance from '../axiosInstance';  // Assuming axiosInstance is set up correctly

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null);  // Store user data
    const token = ref<string | null>(localStorage.getItem('authToken') || null);  // Store JWT token
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

    // Fetch tasks based on filter (all, my, shared)
    const fetchTasks = async () => {
        const userId = Number(localStorage.getItem('userId'));  // Ensure userId is treated as a number
        try {
            const response = await axiosInstance.get(`/tasks?filter=${filter.value}&user_id=${userId}`);
            tasks.value = response.data.tasks;  // Assuming the response has 'tasks' field
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
        }
    };

    // Create a new task
    const createTask = async (title: string, description: string) => {
        const userId = Number(localStorage.getItem('userId'));  // Ensure userId is treated as a number
        try {
            const response = await axiosInstance.post('/tasks', {
                title,
                description,
                created_by: userId,  // Pass userId as number
            });
            tasks.value.push(response.data);  // Add task to local tasks array
        } catch (error) {
            console.error('Error creating task:', error.message);
        }
    };

    // Share a task
    const shareTask = async (taskId: number) => {
        const userId = Number(localStorage.getItem('userId'));  // Ensure userId is treated as a number
        try {
            await axiosInstance.post('/tasks/share', { task_id: taskId, user_id: userId });
            console.log('Task shared successfully');
        } catch (error) {
            console.error('Error sharing task:', error.message);
        }
    };

    // Set filter and fetch tasks accordingly
    const setFilter = (newFilter: string) => {
        filter.value = newFilter;
        fetchTasks();
    };

    // Get filtered tasks
    const getFilteredTasks = () => {
        // Ensure tasks.value is always an array (initialize if undefined)
        const tasksArray = Array.isArray(tasks.value) ? tasks.value : [];
        const userId = Number(localStorage.getItem('userId'));  // Convert to number

        const filteredTasks = tasksArray.filter(task => {
            // Filtering logic based on task type (all, my, shared)
            return filter.value === 'all' ||
                (filter.value === 'my' && task.created_by === userId) ||
                (filter.value === 'shared' && task.shared_with && task.shared_with.includes(userId));
        });

        console.log("Filtered tasks:", filteredTasks);
        return filteredTasks;
    };

    return {
        user,
        token,
        tasks,
        filter,
        setUser,
        setToken,
        logout,
        fetchTasks,
        createTask,
        shareTask,
        setFilter,
        getFilteredTasks,
    };
});
