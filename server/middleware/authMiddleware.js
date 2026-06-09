import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com',
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

  if (!projectId) {
    console.error('Server Configuration Error: VITE_FIREBASE_PROJECT_ID is not set in .env');
    return res.status(500).json({ success: false, message: 'Internal server configuration error' });
  }

  jwt.verify(
    token,
    getKey,
    {
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
      algorithms: ['RS256']
    },
    (err, decoded) => {
      if (err) {
        console.error('JWT Verification Error:', err.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired authorization token' });
      }
      req.user = decoded;
      next();
    }
  );
};
