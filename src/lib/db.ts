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

export const pool =
  global.pgPool ??
  new Pool({
    connectionString,
  })

if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pool
}

export async function query(text: string, params?: any[]) {
  const result = await pool.query(text, params)
  return result
}


export async function transaction<T>(work: (client: import('pg').PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try { await client.query('BEGIN'); const result = await work(client); await client.query('COMMIT'); return result }
  catch (error) { await client.query('ROLLBACK'); throw error }
  finally { client.release() }
}
