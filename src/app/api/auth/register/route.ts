import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const existing = await query<{ id: number }>('SELECT id FROM accounts WHERE email = $1', [email])
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json({ error: 'Account with this email already exists.' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const result = await query<{ id: number; email: string }>(
      `INSERT INTO accounts (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [email, passwordHash, name ?? null],
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

