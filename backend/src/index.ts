import fastify from 'fastify';
import userRoutes from './routes/userRoutes.ts';
import taskRoutes from './routes/taskRoutes.ts';

require('dotenv').config();


// Create Fastify instance with logger enabled
export const app = fastify({
    logger: {
        level: 'info',
    },
});

// Sample route
app.get('/', async (request, reply) => {
    return { hello: 'world' };
});

app.register(userRoutes);
app.register(taskRoutes);

// Start the server with async/await
const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        const host = process.env.HOST || '0.0.0.0';
        const address = await app.listen({ port: Number(port), host: host });
        app.log.info(`Server listening at ${address}`);
    } catch (err) {
        app.log.error(err.message);
        console.log('Error is coming', err.message);
        process.exit(1);  // Exit the process with error if server fails to start
    }
};

start();
