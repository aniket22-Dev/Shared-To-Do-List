import { FastifyInstance } from 'fastify';
import admin from '../firebase'; // Firebase Admin SDK initialization
import { createUser, createCustomToken } from '../db'; // Database functions (for user creation in PostgreSQL)

export default async function userRoutes(fastify: FastifyInstance) {
    // Route to create a new user (signup)
    fastify.post('/signup', async (request, reply) => {
        const { email, password } = request.body as { email: string; password: string };

        try {
            // Create user in Firebase Authentication
            const userRecord = await admin.auth().createUser({
                email: email,
                password: password,
            });

            // Optionally, create the user in PostgreSQL if needed
            const result = await createUser(email, password); // You can save additional user info here
            return reply.send(result);
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });

    // Route to login user (Firebase Authentication)
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body as { email: string; password: string };

        // For backend authentication, we create a custom token for this user
        try {
            // Create a new user if needed (in your case, you may skip this if users are already created)
            const userRecord = await admin.auth().getUserByEmail(email);
            if (!userRecord) {
                return reply.status(400).send({ error: 'User not found' });
            }

            // Create custom token for the user to authenticate them
            const customToken = await admin.auth().createCustomToken(userRecord.uid);
            return reply.send({ customToken });
        } catch (error) {
            return reply.status(400).send({ error: 'Error logging in: ' + error.message });
        }
    });

    // Route to verify the user’s ID token (for any subsequent authenticated requests)
    fastify.post('/verifyToken', async (request, reply) => {
        const { idToken } = request.body as { idToken: string };

        try {
            // Verify the ID token sent from the frontend
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;

            // Optionally, fetch user data from PostgreSQL or perform other actions
            return reply.send({ uid, message: 'User authenticated successfully' });
        } catch (error) {
            return reply.status(400).send({ error: 'Invalid or expired ID token' });
        }
    });
}
