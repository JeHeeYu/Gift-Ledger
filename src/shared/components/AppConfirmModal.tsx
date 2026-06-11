import AppButton from './AppButton'
import AppIcon from './AppIcon'

type AppConfirmModalProps = {
  body: string
  confirmLabel: string
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => Promise<void> | void
  title: string
}

const AppConfirmModal = ({
  body,
  confirmLabel,
  isOpen,
  onCancel,
  onConfirm,
  title,
}: AppConfirmModalProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="app-modal-backdrop"
      onMouseDown={onCancel}
      role="presentation"
    >
      <section
        aria-modal="true"
        className="app-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="app-modal__header">
          <h2>{title}</h2>
          <button
            aria-label="닫기"
            className="icon-button"
            onClick={onCancel}
            type="button"
          >
            <AppIcon name="x" />
          </button>
        </div>
        <p className="app-modal__body">{body}</p>
        <div className="app-modal__actions">
          <AppButton
            onClick={onCancel}
            variant="secondary"
          >
            취소
          </AppButton>
          <AppButton
            onClick={onConfirm}
            variant="dangerGhost"
          >
            {confirmLabel}
          </AppButton>
        </div>
      </section>
    </div>
  )
}

export default AppConfirmModal
