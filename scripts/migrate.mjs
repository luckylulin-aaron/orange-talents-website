import { readFile } from 'node:fs/promises'
import { Pool } from 'pg'
import nextEnv from '@next/env'
nextEnv.loadEnvConfig(process.cwd())
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL before running migrations.')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
try {
 await pool.query(await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8'))
 await pool.query(await readFile(new URL('../db/migrations/20261022_opportunities.sql', import.meta.url), 'utf8'))
 const source = JSON.parse(await readFile(new URL('../src/data/jobs.json', import.meta.url), 'utf8'))
 const seen = new Set()
 for (const job of [...source.featuredJobs, ...source.heroJobs]) {
  if (seen.has(job.link)) continue
  seen.add(job.link)
  await pool.query("INSERT INTO jobs (slug,title,category,summary,status,published_at) VALUES ($1,$2,$3,$4,'published',NOW()) ON CONFLICT (slug) DO NOTHING",
   [job.link.replace('/jobs/',''),job.title,job.category,job.description || ''])
 }
 console.log('Migration complete. Existing jobs, accounts and applications preserved.')
} finally { await pool.end() }
