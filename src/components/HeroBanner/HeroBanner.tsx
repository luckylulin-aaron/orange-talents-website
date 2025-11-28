'use client'

import Link from 'next/link'
import Image from 'next/image'
import ArrowIcon from '@/components/common/ArrowIcon'
import styles from './HeroBanner.module.scss'

const HeroBanner = () => {
  return (
    <section className={styles.hero} aria-labelledby="hero-headline">
      <div className={styles.heroInner}>
        <div className={styles.panel}>
          <div className={styles.texture} aria-hidden />
          <div className={styles.wordTexture} aria-hidden />
          <div className={styles.accent} aria-hidden />

          <div className={styles.copy}>
            <p className={styles.kicker}>Orange Talents</p>
            <h1 id="hero-headline" className={styles.title}>
              Go Global with Orange Talents
            </h1>
            <p className={styles.body}>
              We&apos;re a specialized executive recruitment agency, with senior consultants averaging over six years of
              hands-on experience. We&apos;ve interviewed 1000+ enterprises striving to bring together candidates and
              employers with uniqueness.
            </p>

            <div className={styles.actions}>
              <Link href="/jobs" className={styles.primaryCta}>
                <span>Search for jobs</span>
                <ArrowIcon size={18} />
              </Link>
              <Link href="/talents" className={styles.secondaryCta}>
                <span>Look for talents</span>
                <ArrowIcon size={18} />
              </Link>
            </div>
          </div>

          <div className={styles.visual}>
            <div className={styles.portraitFrame}>
              <Image
                src="/images/updated_images/Citrus tree.jpg"
                alt="Orange Talents global team"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner

