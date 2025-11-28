import type { Metadata } from 'next'
import './globals.css'
import '@/styles/enhancements.scss'

export const metadata: Metadata = {
  title: 'Orange Talents',
  description: 'Orange Talents connects global experts with growth-focused companies.',
  keywords: ['Orange Talents', 'recruitment', 'talent advisory', 'global hiring'],
  icons: {
    icon: '/images/updated_images/orangetalents_logo.jpg',
    shortcut: '/images/updated_images/orangetalents_logo.jpg',
    apple: '/images/updated_images/orangetalents_logo.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

