import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const result = await query('SELECT id, email, password_hash FROM accounts WHERE email = $1', [email])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const user = result.rows[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email })

    const response = NextResponse.json({ id: user.id, email: user.email }, { status: 200 })
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
    console.error('Error in /api/auth/login', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

