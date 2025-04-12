import { FastifyInstance } from 'fastify';
import { createUser, createCustomToken } from '../db.ts';
import admin from '../firebase.ts';

export default async function userRoutes(fastify: FastifyInstance) {
    // Route to sign up user (create user and authenticate with Firebase)
    fastify.post('/signup', async (request, reply) => {
        const { email, password } = request.body as { email: string; password: string };

        try {
            // Check if the user already exists in Firebase
            let userRecord;
            try {
                userRecord = await admin.auth().getUserByEmail(email);
            } catch (error) {
                if (error.code !== 'auth/user-not-found') {
                    // If error is not user-not-found, rethrow it
                    throw error;
                }
            }

            if (userRecord) {
                return reply.status(400).send({ error: 'User already exists' });
            }

            // Create the user in Firebase
            const userCredential = await admin.auth().createUser({
                email,
                password,
            });

            // After user is created in Firebase, create the user in PostgreSQL
            const result = await createUser(email, password); // Save user info in DB
            const newUser = userCredential.user;

            // Optionally, you can return the user data or a token for subsequent requests
            const customToken = await admin.auth().createCustomToken(newUser.uid);

            // Respond with user data and custom token for the frontend to use
            return reply.send({
                message: 'User created successfully',
                customToken,
                user: {
                    email: newUser.email,
                    uid: newUser.uid,
                },
            });
        } catch (error) {
            console.error('Error during sign up:', error);
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
