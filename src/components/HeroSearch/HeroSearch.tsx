'use client'

import SearchBar from '@/components/SearchBar/SearchBar'
import styles from './HeroSearch.module.scss'

const HeroSearch = () => {
  return (
    <section className={styles.section} aria-labelledby="hero-search-label">
      <div className={`container ${styles.inner}`}>
        <p id="hero-search-label" className={styles.label}>
          Search open roles across 30+ countries
        </p>
        <SearchBar className={styles.bar} align="start" />
      </div>
    </section>
  )
}

export default HeroSearch

