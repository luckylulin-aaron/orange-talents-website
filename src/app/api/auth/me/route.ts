import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const payload = verifyToken<{ userId: number }>(token)

    const result = await query('SELECT id, email, name FROM accounts WHERE id = $1', [payload.userId])

    if (result.rowCount === 0) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user: result.rows[0] }, { status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/auth/me', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}

