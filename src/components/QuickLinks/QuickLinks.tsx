import Link from '@/components/common/NoLink'
import styles from './QuickLinks.module.scss'

const QuickLinks = () => {
  const links = [
    {
      id: 1,
      text: 'Feedback on us or the website',
      mobileText: 'Send feedback',
      href: '/feedback'
    },
    {
      id: 2,
      text: 'Get in touch with us for more info',
      mobileText: 'Contact us',
      href: '/contact'
    }
  ]

  return (
    <section className={styles.section}>
      <div className="container">
        <div className="col-8 col-offset-2 col-12-mobile col-offset-mobile-0 pa-0-mobile">
          <h2 className={`headline-1 text-center mb-l mb-mobile-s ${styles.title}`}>
            6. Quick Clicks
          </h2>
          
          {links.map((link) => (
            <Link
              key={link.id}
              className={`mb-8 mb-mobile-xxxxxs ${styles.container}`}
              href={link.href}
            >
              <p className={`ma-0 is-visible-desktop is-hidden-mobile paragraph-2 ${styles.text}`}>
                {link.text}
              </p>
              <p className={`ma-0 is-hidden-desktop is-visible-mobile paragraph-2 ${styles.text}`}>
                <span>{link.mobileText}</span>
              </p>
              <div className={styles.button}>
                <span className={styles.arrowWrapper}>
                  <span className={styles.arrowLeft}></span>
                  <span className={styles.arrowRight}></span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default QuickLinks




