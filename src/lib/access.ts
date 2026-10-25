import { NextRequest } from 'next/server'
import { verifyToken } from './auth'
import { query } from './db'
export class HttpError extends Error { constructor(public status: number, message: string) { super(message) } }
export async function currentAccount(request: NextRequest) {
  let userId: number
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) throw new Error('missing')
    userId = verifyToken<{ userId: number }>(token).userId
    if (!Number.isSafeInteger(userId) || userId <= 0) throw new Error('invalid')
  } catch { throw new HttpError(401, 'Please sign in.') }
  const result = await query('SELECT id, email, name FROM accounts WHERE id = $1', [userId])
  if (!result.rows[0]) throw new HttpError(401, 'Please sign in.')
  return result.rows[0] as { id: number; email: string; name: string | null }
}
export function canManageJobs(email: string) {
  // MK editors receive only job-management access, not all administrator privileges.
  return [process.env.JOB_EDITOR_EMAILS, process.env.ADMIN_EMAILS].join(',').split(',')
    .map(v => v.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase())
}
export async function requireJobEditor(request: NextRequest) {
  const account = await currentAccount(request)
  if (!canManageJobs(account.email)) throw new HttpError(403, 'This account cannot manage jobs.')
  return account
}
export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  const configured = [process.env.NEXT_PUBLIC_SITE_URL, ...(process.env.ALLOWED_ORIGINS || '').split(',')].map(value => value?.trim()).filter((value): value is string => Boolean(value))
  const allowed = configured.length ? configured.map(value => new URL(value).origin) : [request.nextUrl.origin]
  if (!origin || !allowed.includes(origin)) throw new HttpError(403, 'Invalid request origin.')
}
export function apiError(error: unknown) {
  return Response.json({ error: error instanceof HttpError ? error.message : 'Unable to complete the request. Please try again.' },
    { status: error instanceof HttpError ? error.status : 500 })
}
