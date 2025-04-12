import { Client } from 'pg';
import admin from './firebase';

// PostgreSQL client connection setup
export const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Connect to PostgreSQL
client.connect()
    .then(() => console.log('Connected to PostgreSQL!'))
    .catch((err: { stack: any; }) => console.error('Connection error', err.stack));

export const createUser = async (email: string, password: string) => {
    try {
        const result = await client.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, password]
        );
        return result.rows[0]; // Return the created user
    } catch (error: any) {
        throw new Error('Error creating user: ' + error.message);
    }
};

export const createCustomToken = async (uid: string) => {
    try {
        const customToken = await admin.auth().createCustomToken(uid);
        return customToken;
    } catch (error: any) {
        throw new Error('Error creating custom token: ' + error.message);
    }
};


// Fetch all tasks
export const getAllTasks = async () => {
    try {
        const result = await client.query('SELECT * FROM tasks');
        return result.rows;
    } catch (error: any) {
        throw new Error('Error fetching all tasks: ' + error.message);
    }
};

// Fetch tasks created by a specific user
export const getMyTasks = async (userId: number) => {
    try {
        const result = await client.query(
            'SELECT * FROM tasks WHERE created_by = $1',
            [userId]
        );
        return result.rows;
    } catch (error: any) {
        throw new Error('Error fetching my tasks: ' + error.message);
    }
};

// Fetch tasks shared with a specific user
export const getSharedTasks = async (userId: number) => {
    try {
        const result = await client.query(
            `SELECT t.* 
             FROM tasks t 
             JOIN shared_tasks st ON t.id = st.task_id 
             WHERE st.user_id = $1`,
            [userId]
        );
        return result.rows;
    } catch (error: any) {
        throw new Error('Error fetching shared tasks: ' + error.message);
    }
};

// Create a new task
export const createTask = async (title: string, description: string, created_by: number) => {
    try {
        const result = await client.query(
            'INSERT INTO tasks (title, description, created_by) VALUES ($1, $2, $3) RETURNING *',
            [title, description, created_by]
        );
        return result.rows[0];  // Return created task
    } catch (error: any) {
        throw new Error('Error creating task: ' + error.message);
    }
};

// Share a task with a user
export const shareTask = async (taskId: number, userId: number) => {
    try {
        const result = await client.query(
            'INSERT INTO shared_tasks (task_id, user_id) VALUES ($1, $2) RETURNING *',
            [taskId, userId]
        );
        return result.rows[0];  // Return shared task entry
    } catch (error: any) {
        throw new Error('Error sharing task: ' + error.message);
    }
};
