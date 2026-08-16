import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ApplicationChannels from '@/components/ApplicationChannels/ApplicationChannels'
import {
  applicationChannels,
  FULL_TIME_INTERNSHIP_APPLICATION_URL,
} from '@/data/applicationChannels'
import styles from './JoinUs.module.scss'
import SaveJobButton from '@/components/SaveJobButton/SaveJobButton'

const roles = [
  {
    id: 1,
    title: 'Recruiting Analyst, Orange Talents',
    location: 'Shenzhen or Remote',
    type: 'Full-time',
    jobLink: '/jobs/recruiting-analyst',
    jobCategory: 'Opportunities',
  },
  {
    id: 2,
    title: 'Talent Consultant (Early Career)',
    location: 'Shenzhen or Remote',
    type: 'Full-time',
    jobLink: '/jobs/talent-consultant',
    jobCategory: 'Opportunities',
  },
]

export default function JoinUsPage() {
  return (
    <div className="site">
      <Header />

      <main className="main">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Join Us</p>
            <h1 className={styles.title}>Grow your career with Orange Talents</h1>
            <p className={styles.subtitle}>
              We are building a small, focused team of consultants and analysts who are curious about people, global
              markets, and cross-border opportunities.
            </p>
            <div className={styles.heroActions}>
              <a href="#open-roles" className={styles.primaryCta}>
                View open roles
              </a>
              <a href="#application-channels" className={styles.secondaryCta}>
                Explore application channels →
              </a>
            </div>
          </div>
        </section>

        <ApplicationChannels />

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Why join Orange Talents</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <p className={styles.benefitTitle}>Real impact with clients</p>
                <p className={styles.benefitText}>
                  Work directly with founders, business leaders, and HR decision-makers on strategic hiring needs.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <p className={styles.benefitTitle}>China-linked & go-global focus</p>
                <p className={styles.benefitText}>
                  Dive into cross-border talent flows and growth stories between China and the world.
                </p>
              </div>
              <div className={styles.benefitCard}>
                <p className={styles.benefitTitle}>Room to grow</p>
                <p className={styles.benefitText}>
                  Develop consulting, research, and communication skills with close mentorship from senior teammates.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="open-roles" className={`${styles.section} ${styles.sectionLight}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Open roles at Orange Talents</h2>
            <div className={styles.rolesList}>
              {roles.map((role) => (
                <article key={role.id} className={styles.roleCard}>
                  <div className={styles.roleHeader}>
                    <h3 className={styles.roleTitle}>
                      <Link href={role.jobLink} className={styles.roleTitleLink}>
                        {role.title}
                      </Link>
                    </h3>
                    <p className={styles.roleMeta}>
                      {role.location} · {role.type}
                    </p>
                  </div>
                  <div className={styles.roleApply}>
                    <span className={styles.roleApplyLink}>
                      <a
                        href={FULL_TIME_INTERNSHIP_APPLICATION_URL}
                        className={styles.roleApplicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open the Full-time and Internship application form in a new tab"
                      >
                        Apply now &gt;
                      </a>
                    </span>

                    <SaveJobButton
                      jobLink={role.jobLink}
                      jobTitle={role.title}
                      jobCategory={role.jobCategory}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.sectionInner}>
            <p className={styles.contactText}>
              Not seeing the right fit yet? Choose the application channel that matches how you would like to work
              with us.
            </p>
            <nav className={styles.contactLinks} aria-label="Application channel links">
              {applicationChannels.map((channel) => (
                <a
                  key={channel.id}
                  href={channel.href}
                  className={styles.contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={channel.linkAriaLabel}
                >
                  {channel.titleEn} <span aria-hidden="true">→</span>
                </a>
              ))}
            </nav>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

