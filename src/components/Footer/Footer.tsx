'use client'

import Link from 'next/link'
import styles from './Footer.module.scss'

type FooterProps = {
  /** Less top margin for pages where the default 160px gap feels too empty */
  variant?: 'default' | 'compact'
}

const Footer = ({ variant = 'default' }: FooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const rootClass =
    variant === 'compact' ? `${styles.container} ${styles.containerCompact}` : styles.container

  return (
    <footer id="js-footer" className={rootClass}>
      <div className={`container p-relative color-white ${styles.content}`}>
        <div className={`is-hidden-mobile ${styles.scrollButton}`}>
          <button aria-label="Scroll to top" className={styles.scrollBtn} onClick={scrollToTop}>
            ↑
          </button>
        </div>

        <div className={styles.note}>
          <h3>Orange Talents</h3>
          <p>
            We partner with global enterprises and remarkable candidates who share the same values. Reach out any time—our
            team is here to help you go global with confidence.
          </p>
        </div>

        <div className={styles.legalRow}>
          <Link className={styles.legalLink} href="/" aria-label="Orange Talents home">
            © 2026 Orange Talents.
          </Link>
          <Link className={styles.legalLink} href="/legal">
            Legal
          </Link>
          <Link className={styles.legalLink} href="/privacy-center">
            Privacy center
          </Link>
          <Link className={styles.legalLink} href="/candidate-privacy-policy">
            Privacy policy
          </Link>
          <Link className={styles.legalLink} href="/about-ads">
            About ads
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer




