import { FastifyInstance } from 'fastify';
import { createUser, createCustomToken } from '../db.ts';
import admin from '../firebase.ts';

export default async function userRoutes(fastify: FastifyInstance) {
    // Route to sign up user (create user and authenticate with Firebase)
    fastify.post('/signup', async (request, reply) => {
        const { email, password } = request.body as { email: string; password: string };

        try {
            // Check if user already exists
            const userRecord = await admin.auth().getUserByEmail(email);
            if (userRecord) {
                return reply.status(400).send({ error: 'User already exists' });
            }

            // Create user in Firebase
            await admin.auth().createUser({
                email,
                password,
            });

            // Optionally, create the user in PostgreSQL if needed
            const result = await createUser(email, password); // Save additional user info here
            return reply.send(result);
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });

    // Route to login user (Firebase Authentication)
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body as { email: string; password: string };

        try {
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
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;

            return reply.send({ uid, message: 'User authenticated successfully' });
        } catch (error) {
            return reply.status(400).send({ error: 'Invalid or expired ID token' });
        }
    });
}
