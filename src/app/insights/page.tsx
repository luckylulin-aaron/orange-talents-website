'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import insightsData from '@/data/insights.json'
import styles from './Insights.module.scss'

type TagFilter = 'All' | 'Talent' | 'Employers' | 'Career' | 'China-linked' | 'Go-global'

const TAGS: TagFilter[] = ['All', 'Talent', 'Employers', 'Career', 'China-linked', 'Go-global']

export default function InsightsPage() {
  const [activeTag, setActiveTag] = useState<TagFilter>('All')

  const featured = insightsData.featured[0]

  const filteredItems = insightsData.all.filter((item) =>
    activeTag === 'All' ? true : item.tags.includes(activeTag),
  )

  return (
    <div className="site">
      <Header />

      <main className="main">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Insights</p>
            <h1 className={styles.title}>Stories &amp; observations from Orange Talents</h1>
            <p className={styles.subtitle}>
              Short notes from our everyday conversations with candidates and employers across China-linked and
              go-global markets.
            </p>
            <div className={styles.filters}>
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`${styles.filterButton} ${activeTag === tag ? 'active' : ''}`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Featured insight</h2>
            <div className={styles.featuredGrid}>
              {featured && (
                <article className={styles.featuredCard}>
                  <p className={styles.featuredMeta}>
                    {featured.date} · {featured.readingTime}
                  </p>
                  <h3 className={styles.featuredTitle}>{featured.title}</h3>
                  <p className={styles.featuredSummary}>{featured.summary}</p>
                  <Link href={`/insights/${featured.id}`} className={styles.featuredLink}>
                    Read more &gt;
                  </Link>
                </article>
              )}
            </div>

            <div className={styles.listGrid}>
              {filteredItems.map((item) => (
                <article key={item.id} className={styles.card}>
                  <p className={styles.cardMeta}>
                    {item.date} · {item.readingTime}
                  </p>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardSummary}>{item.summary}</p>
                  <Link href={`/insights/${item.id}`} className={styles.cardLink}>
                    Read more &gt;
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

