import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL is not set. API routes that depend on the database will fail.')
}

const pool =
  global.pgPool ??
  new Pool({
    connectionString,
  })

if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pool
}

export async function query<T = any>(text: string, params?: any[]) {
  const result = await pool.query<T>(text, params)
  return result
}

