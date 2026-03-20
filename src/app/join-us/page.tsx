import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
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
    applyLink: 'mailto:people@orangetalents.com?subject=Application%20-%20Recruiting%20Analyst',
  },
  {
    id: 2,
    title: 'Talent Consultant (Early Career)',
    location: 'Shenzhen or Remote',
    type: 'Full-time',
    jobLink: '/jobs/talent-consultant',
    jobCategory: 'Opportunities',
    applyLink: 'mailto:people@orangetalents.com?subject=Application%20-%20Talent%20Consultant%20(Early%20Career)',
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
              <a href="mailto:people@orangetalents.com" className={styles.secondaryCta}>
                Or send us your resume →
              </a>
            </div>
          </div>
        </section>

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
                    <p className={styles.roleTitle}>{role.title}</p>
                    <p className={styles.roleMeta}>
                      {role.location} · {role.type}
                    </p>
                  </div>
                  <p className={styles.roleApply}>
                    <span className={styles.roleApplyLink}>
                      <a href={role.applyLink} className={styles.applyLink}>
                        Apply via email &gt;
                      </a>
                    </span>

                    <SaveJobButton
                      jobLink={role.jobLink}
                      jobTitle={role.title}
                      jobCategory={role.jobCategory}
                    />
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.sectionInner}>
            <p className={styles.contactText}>
              Not seeing a perfect fit yet? You are welcome to send us your resume and a short introduction to{' '}
              <a href="mailto:people@orangetalents.com" className={styles.emailLink}>
                people@orangetalents.com
              </a>{' '}
              and we will reach out when a suitable role opens up.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

