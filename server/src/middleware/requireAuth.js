import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  // One generic message for every failure, so we never say why it failed
  const notAuthenticated = { message: 'Not authenticated' };

  // Header must look like: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(notAuthenticated);
  }

  const token = authHeader.split(' ')[1];

  let payload;
  try {
    // Throws if the token was tampered with or has expired
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json(notAuthenticated);
  }

  // Keep only what we need: the user id from the token
  req.userId = payload.id;

  // Outside the try, so a later error is not mistaken for a bad token
  next();
}