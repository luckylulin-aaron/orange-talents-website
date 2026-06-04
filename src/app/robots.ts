import type { MetadataRoute } from 'next'

const siteUrlString = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const siteUrl = (() => {
  try {
    return new URL(siteUrlString)
  } catch {
    return new URL('http://localhost:3000')
  }
})()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/account', '/api', '/admin'],
      },
    ],
    sitemap: `${siteUrl.toString()}/sitemap.xml`,
  }
}

