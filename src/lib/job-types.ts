export type Job = {
  id: number; slug: string; title: string; category: string; summary: string;
  responsibilities: string; requirements: string; next_steps: string;
  company_type: string; specialization: string; industry: string; job_function: string;
  job_type: string; contract_type: string; salary: string; location: string; region: string; consultant: string;
  contact_email: string; contact_phone: string; reference: string;
  status: 'draft' | 'published' | 'closed'; version: number;
  created_at: string; updated_at: string; published_at: string | null;
}
export const jobLink = (job: Pick<Job, 'slug'>) => '/jobs/' + job.slug
