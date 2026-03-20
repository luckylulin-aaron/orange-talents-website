import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

type AuthPayload = { userId: number; email: string }

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ isAdmin: false }, { status: 401 })

  try {
    const payload = verifyToken<AuthPayload>(token)
    const adminEmails = getAdminEmails()
    const isAdmin = adminEmails.length > 0 && adminEmails.includes(String(payload.email).toLowerCase())

    // If you prefer to support "admin by DB list" in the future,
    // this is where you'd query the database.
    if (adminEmails.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('ADMIN_EMAILS is not set; treating everyone as non-admin.')
    }

    // Touch DB to ensure connection is available for admin-only calls.
    // (No-op query: verify account exists)
    await query('SELECT id FROM accounts WHERE id = $1', [payload.userId])

    return NextResponse.json({ isAdmin }, { status: 200 })
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 401 })
  }
}

