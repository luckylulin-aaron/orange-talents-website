import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import insightsData from '@/data/insights.json'
import styles from '../Insights.module.scss'

type InsightParams = {
  params: {
    id: string
  }
}

const renderBody = (id: string) => {
  if (id === 'china-linked-talent-trends') {
    return (
      <>
        <p className={styles.cardSummary}>
          When we speak with candidates and employers who are active between China and the rest of the world, a few
          simple patterns show up again and again. They are not complex theories – just observations from day-to-day
          conversations.
        </p>
        <p className={styles.cardSummary}>
          First, many cross-border candidates are looking for clarity on &quot;where this role sits&quot; in the global
          organisation. Reporting lines, decision rights, and collaboration routines across time zones matter as much as
          the title itself.
        </p>
        <p className={styles.cardSummary}>
          Second, employers who win good talent usually give concrete examples of cross-border projects – not generic
          slogans. Candidates want to hear which markets, which teams, and what kind of impact previous hires have made.
        </p>
        <p className={styles.cardSummary}>
          Finally, both sides value a realistic view on change. Markets, regulations, and business priorities can move
          quickly. Being open about what may evolve in the next 12–24 months often builds more trust than promising
          perfect stability.
        </p>
      </>
    )
  }

  if (id === 'working-with-growth-minded-employers') {
    return (
      <>
        <p className={styles.cardSummary}>
          At Orange Talents we use the phrase &quot;growth-minded employers&quot; quite often. In practice, it is less
          about company size and more about how leaders think about people and hiring.
        </p>
        <p className={styles.cardSummary}>
          Growth-minded founders and HR leaders usually start our conversations with a story, not a job description.
          They explain where the business is going, what has changed recently, and which gaps they have felt in the
          team. This narrative helps us translate strategy into concrete profiles.
        </p>
        <p className={styles.cardSummary}>
          During the search process, these employers are comfortable sharing real constraints – budget, timing,
          uncertainty – instead of pretending everything is fixed. Candidates appreciate this honesty and can then make
          better decisions for themselves and their families.
        </p>
        <p className={styles.cardSummary}>
          After a hire is made, growth-minded employers keep investing in the relationship. They check in frequently
          during the first months, invite feedback, and adjust scope when needed. Over time this turns a single
          placement into a longer-term partnership.
        </p>
      </>
    )
  }

  if (id === 'careers-at-cross-border-agencies') {
    return (
      <>
        <p className={styles.cardSummary}>
          Many early-career professionals ask us what it actually feels like to work at a cross-border recruitment and
          talent advisory firm. The short answer: you learn a lot, very quickly, about people, markets, and yourself.
        </p>
        <p className={styles.cardSummary}>
          On the candidate side, you speak with people from different backgrounds, industries, and locations every
          week. You learn how to ask focused questions, listen between the lines, and understand what really drives
          someone&apos;s next move beyond &quot;better offer&quot;.
        </p>
        <p className={styles.cardSummary}>
          On the client side, you join discussions about market entry, organisation design, and leadership hiring. You
          are often the bridge between global headquarters, local teams, and the talent market – which is a unique place
          to observe how decisions are made.
        </p>
        <p className={styles.cardSummary}>
          Over time, you build a personal toolkit: structured research skills, clear written and spoken communication,
          and the ability to manage many moving pieces at once. These capabilities are valuable whether you stay in
          recruitment, move into HR, or explore other business roles later on.
        </p>
      </>
    )
  }

  return (
    <p className={styles.cardSummary}>
      This is where the full story for &quot;{id}&quot; will live. You can replace this placeholder with your own
      English content when you are ready.
    </p>
  )
}

export default function InsightDetailPage({ params }: InsightParams) {
  const insight =
    insightsData.all.find((item) => item.id === params.id) ??
    insightsData.featured.find((item) => item.id === params.id)

  if (!insight) {
    return (
      <div className="site">
        <Header />
        <main className="main">
          <section className={styles.section}>
            <div className={styles.sectionInner}>
              <p>Insight not found.</p>
              <Link href="/insights">Back to insights</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Insights</p>
            <h1 className={styles.title}>{insight.title}</h1>
            <p className={styles.subtitle}>
              {insight.date} · {insight.readingTime}
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            {renderBody(insight.id)}
            <Link href="/insights" className={styles.cardLink}>
              ← Back to all insights
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

