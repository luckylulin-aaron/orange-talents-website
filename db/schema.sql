CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Jobs that each user can save/bookmark.
-- We store a stable reference to the job using `job_link` (e.g. "/jobs/recruiting-analyst").
CREATE TABLE IF NOT EXISTS saved_jobs (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  job_link TEXT NOT NULL,
  job_title TEXT,
  job_category TEXT,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, job_link)
);

CREATE INDEX IF NOT EXISTS saved_jobs_account_id_idx ON saved_jobs(account_id);

-- Job applications submitted by users.
CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  job_link TEXT NOT NULL,
  job_title TEXT,
  job_category TEXT,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, job_link)
);

CREATE INDEX IF NOT EXISTS job_applications_account_id_idx ON job_applications(account_id);
