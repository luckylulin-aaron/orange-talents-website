import { NextRequest, NextResponse } from 'next/server'
import { canManageJobs } from '@/lib/access'
import { query } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    // Staff access is provisioned privately; public registration must not claim a reserved staff address.
    if (canManageJobs(email.trim())) return NextResponse.json({ error: 'Please contact your administrator to access this staff account.' }, { status: 403 })
    const existing = await query('SELECT id FROM accounts WHERE LOWER(email) = LOWER($1)', [email.trim()])
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json({ error: 'Account with this email already exists.' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const result = await query(
      `INSERT INTO accounts (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [email.trim().toLowerCase(), passwordHash, name ?? null],
    )

    const user = result.rows[0]
    const token = signToken({ userId: user.id, email: user.email })

    const response = NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/auth/register', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

