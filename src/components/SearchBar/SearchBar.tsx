'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Image from 'next/image'
import styles from './SearchBar.module.scss'

type SearchBarProps = {
  className?: string
  isElevated?: boolean
  align?: 'center' | 'start'
}

const SearchBar = ({ className = '', isElevated = true, align = 'center' }: SearchBarProps = {}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (event: FormEvent<HTMLFormElement> | FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className={`${styles.wrapper} ${align === 'start' ? styles.alignStart : ''} ${className}`}>
      <form
        className={`${styles.search} ${isElevated ? styles.elevated : ''}`}
        aria-label="Search for jobs"
        onSubmit={handleSearch}
      >
        <Image 
          src="/images/icons/icon-search-opacity-700.svg"
          alt=""
          width={24}
          height={24}
          className={styles.searchIcon}
        />
        <div className={styles.searchInputContainer}>
          <input
            aria-label="Search for jobs and keywords"
            placeholder="Search jobs and keywords"
            className={`paragraph-2 ${styles.searchInput}`}
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div className={styles.searchSubmitButton}>
          <button 
            aria-label="Search"
            className={styles.arrowButton}
            type="submit"
            onClick={handleSearch}
          >
            →
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar