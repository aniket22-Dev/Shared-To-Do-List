import fastify from 'fastify';
import userRoutes from './routes/userRoutes.ts';
import taskRoutes from './routes/taskRoutes.ts';
import axios from 'axios';  // Import axios to make HTTP requests
import fastifyCors from '@fastify/cors';  // Import the updated CORS plugin

require('dotenv').config();

// Create Fastify instance with logger enabled
export const app = fastify({
    logger: {
        level: 'info',
    },
});

// Register CORS plugin with default options (this will allow all origins)
app.register(fastifyCors, {
    origin: '*',  // Allow all origins (you can restrict this to specific domains if needed)
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

// Function to ping the server
const pingServer = async () => {
    try {
        await axios.get('https://shared-to-do-list.onrender.com');  // Ping the server
        app.log.info("Server pinged successfully");
    } catch (error) {
        app.log.error("Error pinging the server:", error.message);  // Log the error message if the ping fails
    }
};

// Set interval to ping the server every 30 seconds
setInterval(pingServer, 30000);

start();
