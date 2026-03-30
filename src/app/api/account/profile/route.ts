import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

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

export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { name } = await request.json()

    if (typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name.' }, { status: 400 })
    }

    const trimmed = name.trim()

    await query('UPDATE accounts SET name = $1 WHERE id = $2', [trimmed || null, userId])

    return NextResponse.json({ success: true, name: trimmed || null }, { status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in PATCH /api/account/profile', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
