import { useEffect } from 'react'
import AppIcon from './AppIcon'

type AppResultPopupProps = {
  isOpen: boolean
  message: string
  onClose: () => void
}

const AppResultPopup = ({
  isOpen,
  message,
  onClose,
}: AppResultPopupProps) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const timeoutId = window.setTimeout(onClose, 1600)

    return () => window.clearTimeout(timeoutId)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      aria-live="polite"
      className="app-result-popup"
      role="status"
    >
      <span className="app-result-popup__icon">
        <AppIcon name="check" />
      </span>
      <strong>{message}</strong>
    </div>
  )
}

export default AppResultPopup
