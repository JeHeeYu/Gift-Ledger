import type { ButtonHTMLAttributes, ReactNode } from 'react'

type AppButtonVariant = 'dangerGhost' | 'ghost' | 'primary' | 'secondary'

type AppButtonProps = {
  children: ReactNode
  className?: string
  leadingIcon?: ReactNode
  variant?: AppButtonVariant
} & ButtonHTMLAttributes<HTMLButtonElement>

const AppButton = ({
  children,
  className = '',
  leadingIcon,
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: AppButtonProps) => {
  return (
    <button
      className={['app-button', `app-button--${variant}`, className]
        .filter(Boolean)
        .join(' ')}
      type={type}
      {...buttonProps}
    >
      {leadingIcon}
      <span>{children}</span>
    </button>
  )
}

export default AppButton
