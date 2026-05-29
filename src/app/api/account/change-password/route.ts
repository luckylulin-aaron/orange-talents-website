import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken, verifyPassword, hashPassword } from '@/lib/auth'

function getUserId(request: NextRequest): number | null {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return null
    const payload = verifyToken<{ userId: number }>(token)
    return payload.userId
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new password are required.' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
    }

    const result = await query('SELECT password_hash FROM accounts WHERE id = $1', [userId])
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
    }

    const isValid = await verifyPassword(currentPassword, result.rows[0].password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
    }

    const newHash = await hashPassword(newPassword)
    await query('UPDATE accounts SET password_hash = $1 WHERE id = $2', [newHash, userId])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in POST /api/account/change-password', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
