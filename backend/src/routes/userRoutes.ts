import { FastifyInstance } from 'fastify';
import { createUser, createCustomToken, client } from '../db.ts';
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

            // Log the userCredential to check the returned data
            console.log('Firebase user created:', userCredential);

            // Ensure the UID is present
            if (!userCredential) {
                return reply.status(400).send({ error: 'Failed to retrieve user UID from Firebase' });
            }

            // After user is created in Firebase, create the user in PostgreSQL
            const result = await createUser(email, password); // Save user info in DB
            const newUser = userCredential;

            // Generate custom token for the new user
            const customToken = await admin.auth().createCustomToken(newUser.uid);

            // Respond with user data and custom token for the frontend to use
            return reply.send({
                message: 'User created successfully',
                customToken,
                userId: newUser.uid,  // Send the user ID (UID) alongside the custom token
                user: {
                    email: newUser.email,
                    uid: newUser.uid,  // Return UID here
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
            // Step 1: Fetch the user from Firebase by email
            const userRecord = await admin.auth().getUserByEmail(email);
            if (!userRecord) {
                return reply.status(400).send({ error: 'User not found' });
            }

            // Step 2: Fetch the user from PostgreSQL to get the user ID
            const result = await client.query(
                'SELECT id, email FROM users WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                return reply.status(400).send({ error: 'User not found in the database' });
            }

            // Step 3: Extract user ID from PostgreSQL result
            const userId = result.rows[0].id;

            // Step 4: Create custom token for the user to authenticate them
            const customToken = await admin.auth().createCustomToken(userRecord.uid);

            // Step 5: Send both the custom token and user ID to the frontend
            return reply.send({
                customToken,
                userId,  // Send the user ID from PostgreSQL
            });
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
