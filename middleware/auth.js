const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Sesuaikan path file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const verifyToken = async (request, h) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return h.response({ status: 'fail', message: 'Unauthorized' }).code(401).takeover();
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        request.auth = { userId: decodedToken.uid };
        return h.continue;
    } catch (error) {
        console.error(error);
        return h.response({ status: 'fail', message: 'Invalid token' }).code(401).takeover();
    }
};

module.exports = verifyToken;
