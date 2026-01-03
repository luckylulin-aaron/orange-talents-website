'use client'

import { ReactNode, MouseEvent } from 'react'

type NoLinkProps = {
  href?: string
  className?: string
  children?: ReactNode
  'aria-label'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
  onClick?: (e: MouseEvent<HTMLElement>) => void
  tabIndex?: number
  target?: string
  rel?: string
}

/**
 * NoLink 组件 - 用于替换 Next.js Link，阻止所有跳转
 * 保持与 Link 相同的 API，但渲染为 div 并阻止默认行为
 */
const NoLink = ({
  href,
  className,
  children,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  onClick,
  tabIndex,
  target,
  rel,
  ...rest
}: NoLinkProps) => {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    // 阻止所有跳转
    e.preventDefault()
    e.stopPropagation()
    
    // 如果传入了自定义 onClick，也执行它
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <div
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      style={{ cursor: 'default' }}
      {...rest}
    >
      {children}
    </div>
  )
}

export default NoLink

