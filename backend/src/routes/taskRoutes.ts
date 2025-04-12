import { FastifyInstance } from 'fastify';
import { createTask, shareTask, getAllTasks, getMyTasks, getSharedTasks } from '../db.ts';

export default async function taskRoutes(fastify: FastifyInstance) {
    // Route to create a new task
    fastify.post('/tasks', async (request, reply) => {
        const { title, description, created_by } = request.body as { title: string; description: string; created_by: number };

        try {
            const task = await createTask(title, description, created_by);  // Add task to DB
            return reply.send(task);  // Return created task
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });

    // Route to share a task
    fastify.post('/tasks/share', async (request, reply) => {
        const { task_id, user_id } = request.body as { task_id: number; user_id: number };

        try {
            const sharedTask = await shareTask(task_id, user_id);  // Share task in DB
            return reply.send(sharedTask);
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });

    // Route to get all tasks
    fastify.get('/tasks', async (request, reply) => {
        try {
            const tasks = await getAllTasks();  // Fetch all tasks
            return reply.send(tasks);
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });

    // Route to get tasks created by the authenticated user
    fastify.get('/tasks/my', async (request, reply) => {
        const { user_id } = request.query as { user_id: number };  // Assuming user_id is passed in query

        try {
            const tasks = await getMyTasks(user_id);  // Fetch tasks created by the user
            return reply.send(tasks);
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });

    // Route to get tasks shared with the authenticated user
    fastify.get('/tasks/shared', async (request, reply) => {
        const { user_id } = request.query as { user_id: number };  // Assuming user_id is passed in query

        try {
            const tasks = await getSharedTasks(user_id);  // Fetch tasks shared with the user
            return reply.send(tasks);
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });
}
