'use client'

import Link from '@/components/common/NoLink'
import styles from './LocationScroll.module.scss'
import jobsData from '@/data/jobs.json'

const LocationScroll = () => {
  // 将城市分成3行，每行使用所有城市但不同顺序
  const allCities = jobsData.cities
  
  // 第一行：向右滚动
  const row1Cities = [...allCities, ...allCities.slice(0, 4)]
  
  // 第二行：向左滚动
  const row2Cities = [...allCities.slice(4).reverse(), ...allCities.slice(0, 4).reverse()]
  
  // 第三行：向右滚动
  const row3Cities = [...allCities, ...allCities.slice(0, 4)]

  return (
    <section className={`${styles.section} pb-xxxl pb-mobile-xxl pt-section`}>
      <div className="container block-container mb-l mb-mobile-l">
        <div className="row">
          <div className="col-10-mobile col-offset-mobile-1 col-6 col-offset-3">
            <h2 className="mb-s mb-mobile-xs headline-1 color-white">
              <span>Go Global with Us</span>
            </h2>
            <p className="paragraph-2 color-white">
              Orange Talents bridges enterprises with talented candidates who have shared values around the world.
            </p>
          </div>
        </div>
      </div>

      <div className={`mt-l mt-mobile-l ${styles.scrollWrapper}`}>
        <div className={styles.scrollContainer}>
          {/* Row 1 - 向右滚动 */}
          <div className={`${styles.row} ${styles.rowDefault}`}>
            <div className={`${styles.locations} ${styles.locationsDefault} ${styles.row1}`}>
              {row1Cities.map((city, index) => (
                <Link
                  key={`${city.name}-1-${index}`}
                  className={`no-underline color-ui-black ${styles.locationItem}`}
                  href={city.link}
                >
                  <p className={`ma-0 display-2 ${styles.name}`}>{city.name}</p>
                </Link>
              ))}
            </div>
            {/* 复制一份用于无缝循环 */}
            <div className={`${styles.locations} ${styles.locationsDefault} ${styles.row1}`} aria-hidden="true">
              {row1Cities.map((city, index) => (
                <Link
                  key={`${city.name}-1-dup-${index}`}
                  className={`no-underline color-ui-black ${styles.locationItem}`}
                  href={city.link}
                  tabIndex={-1}
                >
                  <p className={`ma-0 display-2 ${styles.name}`}>{city.name}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2 - 向左滚动 */}
          <div className={`${styles.row} ${styles.rowDefault}`}>
            <div className={`${styles.locations} ${styles.locationsDefault} ${styles.row2}`}>
              {row2Cities.map((city, index) => (
                <Link
                  key={`${city.name}-2-${index}`}
                  className={`no-underline color-ui-black ${styles.locationItem}`}
                  href={city.link}
                >
                  <p className={`ma-0 display-2 ${styles.name}`}>{city.name}</p>
                </Link>
              ))}
            </div>
            {/* 复制一份用于无缝循环 */}
            <div className={`${styles.locations} ${styles.locationsDefault} ${styles.row2}`} aria-hidden="true">
              {row2Cities.map((city, index) => (
                <Link
                  key={`${city.name}-2-dup-${index}`}
                  className={`no-underline color-ui-black ${styles.locationItem}`}
                  href={city.link}
                  tabIndex={-1}
                >
                  <p className={`ma-0 display-2 ${styles.name}`}>{city.name}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 3 - 向右滚动 */}
          <div className={`${styles.row} ${styles.rowDefault}`}>
            <div className={`${styles.locations} ${styles.locationsDefault} ${styles.row3}`}>
              {row3Cities.map((city, index) => (
                <Link
                  key={`${city.name}-3-${index}`}
                  className={`no-underline color-ui-black ${styles.locationItem}`}
                  href={city.link}
                >
                  <p className={`ma-0 display-2 ${styles.name}`}>{city.name}</p>
                </Link>
              ))}
            </div>
            {/* 复制一份用于无缝循环 */}
            <div className={`${styles.locations} ${styles.locationsDefault} ${styles.row3}`} aria-hidden="true">
              {row3Cities.map((city, index) => (
                <Link
                  key={`${city.name}-3-dup-${index}`}
                  className={`no-underline color-ui-black ${styles.locationItem}`}
                  href={city.link}
                  tabIndex={-1}
                >
                  <p className={`ma-0 display-2 ${styles.name}`}>{city.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationScroll
