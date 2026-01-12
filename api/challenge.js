import { createChallenge } from 'altcha-lib';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Generate a secure random HMAC key (in production, use an environment variable)
        const hmacKey = process.env.ALTCHA_HMAC_KEY || 'secret-hmac-key-change-this';

        // Create a new challenge
        const challenge = await createChallenge({
            hmacKey,
            maxNumber: 100000 // Adjust difficulty if needed
        });

        res.status(200).json(challenge);
    } catch (error) {
        console.error('Error generating challenge:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
