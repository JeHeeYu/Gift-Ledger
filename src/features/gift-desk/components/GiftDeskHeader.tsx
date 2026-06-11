import { AppButton, AppIcon } from '../../../shared/components'
import type {
  GiftDeskSummary,
  GiftDeskSyncState,
} from '../types'
import {
  formatReceivedAt,
  formatWon,
} from '../utils/giftDesk'

type GiftDeskHeaderProps = {
  onExport: () => void
  summary: GiftDeskSummary
  syncState: GiftDeskSyncState
}

const GiftDeskHeader = ({
  onExport,
  summary,
  syncState,
}: GiftDeskHeaderProps) => {
  return (
    <header className="ledger-header">
      <div className="ledger-header__title-group">
        <div className="ledger-header__eyebrow">Wedding Gift Desk</div>
        <h1>축의대 명부</h1>
      </div>
      <div className="ledger-header__right">
        <div className={`sync-status sync-status--${syncState.status}`}>
          <span>{syncState.mode === 'firebase' ? '서버 연결' : '로컬 저장'}</span>
          <strong>{syncState.message}</strong>
          <small>
            {syncState.lastSyncedAt
              ? formatReceivedAt(syncState.lastSyncedAt)
              : syncState.eventId}
          </small>
        </div>
        <div className="ledger-header__total">
          <span>총 접수액</span>
          <strong>{formatWon(summary.total)}</strong>
          <small>{summary.count}건 등록</small>
        </div>
        <div className="ledger-header__actions">
          <AppButton
            leadingIcon={<AppIcon className="excel-icon" name="excel" />}
            onClick={onExport}
            variant="secondary"
          >
            엑셀
          </AppButton>
        </div>
      </div>
    </header>
  )
}

export default GiftDeskHeader
