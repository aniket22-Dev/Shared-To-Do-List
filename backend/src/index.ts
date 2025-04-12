import fastify from 'fastify';

const app = fastify();

// Sample route
app.get('/', async (request, reply) => {
    return { hello: 'world' };
});

// Start the server with async/await
const start = async () => {
    try {
        // Correct usage with options object
        const address = await app.listen({ port: 3000, host: '0.0.0.0' });
        app.log.info(`Server listening at ${address}`);
        console.log('App is running')
    } catch (err) {
        app.log.error(err);
        process.exit(1);  // Exit the process with error if server fails to start
    }
};

start();
