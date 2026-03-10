import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn('JWT_SECRET is not set. Authentication routes will not work securely.')
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: { userId: number; email: string }) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken<T = any>(token: string): T {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.verify(token, JWT_SECRET) as T
}

