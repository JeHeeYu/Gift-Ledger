import type { ReactNode } from 'react'

type AppBadgeTextProps = {
  children: ReactNode
  tone?: 'blue' | 'green' | 'gray' | 'orange' | 'pink' | 'red'
}

const AppBadgeText = ({
  children,
  tone = 'gray',
}: AppBadgeTextProps) => {
  return <span className={`app-badge app-badge--${tone}`}>{children}</span>
}

export default AppBadgeText
