import jwt from 'jsonwebtoken';
import { config } from '../config/config.route.js';
import { JWTPayload } from '../models/User.model.js';

export const generateToken = (userId: string, email: string): string => {
  const payload: JWTPayload = {
    userId,
    email,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
