import styles from './ApplicationProgress.module.scss'

const STEPS = [
  { key: 'applied', label: 'Applied' },
  { key: 'resume_screening_passed', label: 'Resume screening passed' },
  { key: 'interviewing', label: 'Interviewing' },
  { key: 'rejected_offered', label: 'Rejected / offered' },
  { key: 'onboarding', label: 'Onboarding' },
] as const

export default function ApplicationProgress({
  phaseIndex,
}: {
  phaseIndex: number
}) {
  const safeIndex = Number.isFinite(phaseIndex) ? Math.max(-1, Math.min(phaseIndex, STEPS.length - 1)) : -1
  const filledUpTo = safeIndex

  return (
    <div className={styles.bar} aria-label="Application progress">
      {STEPS.map((step, idx) => {
        const isActive = idx <= filledUpTo
        const isLineActive = idx < filledUpTo

        return (
          <div key={step.key} className={styles.step}>
            <div className={`${styles.dot} ${isActive ? styles.dotActive : ''}`} />
            {idx < STEPS.length - 1 ? (
              <div className={`${styles.line} ${isLineActive ? styles.lineActive : ''}`} />
            ) : null}
            <div className={styles.label} title={step.label}>
              {step.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

