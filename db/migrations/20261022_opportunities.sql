BEGIN;
CREATE TABLE IF NOT EXISTS jobs (
 id SERIAL PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
 category TEXT NOT NULL DEFAULT 'Opportunities', summary TEXT NOT NULL DEFAULT '',
 responsibilities TEXT NOT NULL DEFAULT '', requirements TEXT NOT NULL DEFAULT '', next_steps TEXT NOT NULL DEFAULT '',
 company_type TEXT NOT NULL DEFAULT '', specialization TEXT NOT NULL DEFAULT '', industry TEXT NOT NULL DEFAULT '',
 job_function TEXT NOT NULL DEFAULT '', job_type TEXT NOT NULL DEFAULT '', salary TEXT NOT NULL DEFAULT '',
 location TEXT NOT NULL DEFAULT '', region TEXT NOT NULL DEFAULT '', consultant TEXT NOT NULL DEFAULT '',
 contact_email TEXT NOT NULL DEFAULT '', contact_phone TEXT NOT NULL DEFAULT '', reference TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','closed')),
 version INTEGER NOT NULL DEFAULT 1, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), published_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE TABLE IF NOT EXISTS job_changes (
 id SERIAL PRIMARY KEY, job_id INTEGER NOT NULL REFERENCES jobs(id), actor_id INTEGER REFERENCES accounts(id),
 payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS resume_name TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS delivery_status TEXT NOT NULL DEFAULT 'legacy';
CREATE TABLE IF NOT EXISTS application_mail (
 application_id INTEGER PRIMARY KEY REFERENCES job_applications(id) ON DELETE CASCADE,
 applicant_email TEXT NOT NULL, applicant_name TEXT NOT NULL,
 resume_name TEXT NOT NULL, resume_type TEXT NOT NULL, resume_bytes BYTEA NOT NULL,
 state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','sending','sent','failed','review')),
 attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_error TEXT, sent_at TIMESTAMPTZ
);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contract_type TEXT NOT NULL DEFAULT '';
COMMIT;
