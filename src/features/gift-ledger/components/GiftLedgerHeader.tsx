import { AppButton, AppIcon } from '../../../shared/components'
import type { GiftLedgerSummary } from '../types'
import { formatWon } from '../utils/giftLedger'

type GiftLedgerHeaderProps = {
  onExport: () => void
  onPrint: () => void
  summary: GiftLedgerSummary
}

const GiftLedgerHeader = ({
  onExport,
  onPrint,
  summary,
}: GiftLedgerHeaderProps) => {
  return (
    <header className="ledger-header">
      <div className="ledger-header__title-group">
        <div className="ledger-header__eyebrow">Wedding Gift Desk</div>
        <h1>축의대 명부</h1>
        <p>2026.06.12 본식 접수 운영</p>
      </div>
      <div className="ledger-header__right">
        <div className="ledger-header__total">
          <span>총 접수액</span>
          <strong>{formatWon(summary.total)}</strong>
          <small>{summary.count}건 등록</small>
        </div>
        <div className="ledger-header__actions">
          <AppButton
            leadingIcon={<AppIcon name="download" />}
            onClick={onExport}
            variant="secondary"
          >
            CSV
          </AppButton>
          <AppButton
            leadingIcon={<AppIcon name="printer" />}
            onClick={onPrint}
            variant="secondary"
          >
            인쇄
          </AppButton>
        </div>
      </div>
    </header>
  )
}

export default GiftLedgerHeader
