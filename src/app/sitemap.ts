import type { MetadataRoute } from 'next'

import jobsData from '@/data/jobs.json'
import insightsData from '@/data/insights.json'

const siteUrlString = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const siteUrl = (() => {
  try {
    return new URL(siteUrlString)
  } catch {
    return new URL('http://localhost:3000')
  }
})()

const baseUrl = siteUrl.toString().replace(/\/$/, '')

const weekly = 'weekly' as const
const monthly = 'monthly' as const

function resolveUrl(path: string) {
  if (path === '/') return `${baseUrl}/`
  return `${baseUrl}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '/',
    '/jobs',
    '/talents',
    '/employers',
    '/about-us',
    '/privacy-center',
    '/legal',
    '/join-us',
    '/feedback',
    '/contact',
    '/about-ads',
    '/candidate-privacy-policy',
    '/insights',
  ]

  const jobLinks = Array.from(
    new Set([...jobsData.featuredJobs, ...jobsData.heroJobs].map((j: any) => j.link)),
  )

  const insightLinks = insightsData.all.map((item: any) => `/insights/${item.id}`)

  return [
    ...staticPaths.map((path) => ({
      url: resolveUrl(path),
      changeFrequency: weekly,
      priority: path === '/' ? 1 : 0.7,
    })),
    ...jobLinks.map((path) => ({
      url: resolveUrl(path),
      changeFrequency: weekly,
      priority: 0.8,
    })),
    ...insightLinks.map((path) => ({
      url: resolveUrl(path),
      changeFrequency: monthly,
      priority: 0.6,
    })),
  ]
}

