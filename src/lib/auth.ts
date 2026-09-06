import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'krishi_market_super_secure_jwt_secret_key_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  name: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req: NextRequest): TokenPayload | null {
  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  // Check Cookie
  const cookie = req.cookies.get('krishi_token')?.value;
  if (cookie) {
    return verifyToken(cookie);
  }

  return null;
}
