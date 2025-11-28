'use client'

type ArrowIconProps = {
  direction?: 'right' | 'up'
  size?: number
  className?: string
}

const ArrowIcon = ({ direction = 'right', size = 20, className = '' }: ArrowIconProps) => {
  const rotation = direction === 'up' ? -90 : 0

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowIcon



