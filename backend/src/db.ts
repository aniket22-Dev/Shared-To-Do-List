import { Client } from 'pg';
import admin from './firebase';
require('dotenv').config();

// PostgreSQL client connection setup
export const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to PostgreSQL
client.connect();

export const createUser = async (email: string, password: string) => {
    try {
        const result = await client.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, password]
        );
        return result.rows[0]; // Return the created user
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};


export const createTask = async (title: string, description: string, createdBy: number) => {
    try {
        const result = await client.query(
            'INSERT INTO tasks (title, description, created_by) VALUES ($1, $2, $3) RETURNING *',
            [title, description, createdBy]
        );
        return result.rows[0];  // Return created task
    } catch (error) {
        throw new Error('Error creating task: ' + error.message);
    }
};


export const shareTask = async (taskId: number, userId: number) => {
    try {
        const result = await client.query(
            'INSERT INTO shared_tasks (task_id, user_id) VALUES ($1, $2) RETURNING *',
            [taskId, userId]
        );
        return result.rows[0];  // Return shared task entry
    } catch (error) {
        throw new Error('Error sharing task: ' + error.message);
    }
};

export const createCustomToken = async (uid: string) => {
    try {
        const customToken = await admin.auth().createCustomToken(uid);
        return customToken;
    } catch (error) {
        throw new Error('Error creating custom token: ' + error.message);
    }
};