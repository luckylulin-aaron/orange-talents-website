import styles from './StaticHero.module.scss'

type StaticHeroProps = {
  eyebrow: string
  title: string
  subtitle: string
  backgroundImage: string
}

export default function StaticHero({ eyebrow, title, subtitle, backgroundImage }: StaticHeroProps) {
  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.9)), url('${backgroundImage}')`,
      }}
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </section>
  )
}

