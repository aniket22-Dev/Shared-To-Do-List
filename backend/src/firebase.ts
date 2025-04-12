import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = path.resolve(__dirname, '../firebase-credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;
